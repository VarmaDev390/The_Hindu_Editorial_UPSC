import React, {useEffect, useContext, useState} from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helper';
import { ContextApp } from '../utils/context';
import axios from 'axios';
import UserDialog from './dialog';


// import StarIcon from '@mui/icons-material/Star';
// import NewReleasesIcon from '@mui/icons-material/NewReleases';

const ArticleCard = ({data}) => {
  const navigate = useNavigate();
  const { currDate, articles, setArticles, userId, setUserId} = useContext(ContextApp)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false);
  // console.log(data)



  

  
    // Fetch data only if userId is available
    const fetchData = async (data) => {
      setLoading(true); // Set loading state
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/get-article`,
          { params: { articleId: data.article_id, userId: userId } }
        );
        // console.log("article",response.data.article)
        // setArticles(response.data.articles);
        navigate(`/article/:${data.article_id}`, { state: { article: response.data.article } });
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false); // Set loading state to false after fetching or error
      }
    };
  
      
    const handleSaveUserId = (newId) => {
      setUserId(newId);
      localStorage.setItem("userId", newId);
      setOpenDialog(false);
      fetchData(data);
    };


  const handleReadArticle = (data) => {
    try {
      const storedUserId = localStorage.getItem("userId");
      // console.log("storedUserId",storedUserId)
    
if (!storedUserId) {
        setOpenDialog(true); // Open dialog if userId is not in localStorage
      } else {
        fetchData(data);
      }
     
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };



  return (
    <>
        <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3, cursor: 'pointer' }} onClick={() => handleReadArticle(data)}>
      {/* <CardMedia
        component="img"
        height="140"
        image="https://source.unsplash.com/random/345x140/?powerlines" // Replace with your image URL
        alt="Power lines"
      /> */}
      <CardContent>
        {/* <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            // icon={<NewReleasesIcon />}
            label="NEW"
            color="warning"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography variant="overline" color="textSecondary">
            CATEGORY • ARTICLE
          </Typography>
        </Stack> */}
        <Typography variant="h6" component="div" fontWeight="bold" mt={1}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          {data.summary}
          <Typography variant="body2" color="primary" component="span" sx={{ cursor: 'pointer' }}>
            + Read More
          </Typography>
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button variant="contained" color="primary" fullWidth >
          READ ARTICLE
        </Button>
      </CardActions> */}
      <Box px={2} py={1} display="flex" justifyContent="space-between" borderTop={1} borderColor="divider">
        {/* <Typography variant="caption" color="textSecondary">
          PROVIDED BY: Schiller-Stroman
        </Typography> */}
        <Typography variant="caption" color="textSecondary">
          {formatDate(data.published_date)}
        </Typography>
      </Box>
    
    </Card>
    <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSaveUserId={handleSaveUserId}
        
      />
    </>

  );
};

export default ArticleCard;
