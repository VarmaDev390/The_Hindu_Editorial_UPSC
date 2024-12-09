import React,{useState, useEffect, useContext} from 'react';
import { Typography, Grid2, Box, Paper, Button, Pagination  } from '@mui/material';
import Layout from '../components/layout';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import VocabCard from '../components/vocabCard';
import { ContextApp } from '../utils/context';


const ImportantVocabulary = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedVocab, setSavedVocab] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
  const {  userId, articles, setArticles} = useContext(ContextApp)

    const itemsPerPage = 9; // Number of items per page

      // Calculate the data to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedVocab.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading state
            console.log("iside fetch", userId);
      
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/saved-vocab`, {
                    
                    userId:userId 
                  });
                  console.log("response",response.data.words)
                  setSavedVocab(response.data.words);
              // console.log("response.data",response.data.articles)
            } catch (err) {
              console.error(err);
              setError("Failed to load saved Vocabulary");
            } finally {
              setLoading(false); // Set loading state to false after fetching or error
            }
        }

        fetchData();
    },[])

    return(

<Layout>
  <Box 
    sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh" 
    }}
  >
    
    {/* Cards Display Section */}
    <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "row", 
          flexWrap: "wrap", 
          gap: 2, // Adds spacing between cards
          marginBottom: 2,
          flex: 1, 
          alignItems: 'flex-start'
        }}
    >
      {currentItems.length > 0 ? (
        currentItems.map((obj, index) => (
          <Grid2 sx={{xs:12, sm:4, md:3}} key={index}> {/* Makes cards responsive */}
            <VocabCard word={obj.word} meaning={obj.meaning} />
          </Grid2>
        ))
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center' }}>No items to display</Box>
      )}
    </Box>

    {/* Pagination Component */}
    <Box 
      sx={{
        display: "flex", 
        justifyContent: "center", 
        mb: 2,
        position: 'relative', // Allows position control
        top: { xs: 'auto', sm: 0 }, // For larger screens, pagination stays at top
        bottom: { xs: 0, sm: 'auto' } // For mobile, move pagination to the bottom
      }}
    >
      <Pagination
        count={Math.ceil(savedVocab.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white', // Changes the color of pagination items
          },
        }}
      />
    </Box>

  </Box>
</Layout>

 
    )
}

export default ImportantVocabulary;

{/* <Layout>
  <Box 
    sx={{ 
      display: "flex", 
      flexDirection: "column", 
      // justifyContent: "space-between", 
      minHeight: "100vh" // Ensures the container takes up the full height of the viewport
    }}
  >
    
    
    <Box sx={{ display: "flex", justifyContent: "center",  mb:2 }}>
      <Pagination
        count={Math.ceil(savedVocab.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{
    '& .MuiPaginationItem-root': {
      color: 'white', // Changes the color of pagination items
    },
  }}
      />
    </Box>
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: 2, // Adds spacing between cards
        marginBottom: 2,
        // flex: 1 // Makes this Box grow to take available space
      }}
    >
      {currentItems.length > 0 ? (
        currentItems.map((obj, index) => (
          <VocabCard key={index} word={obj.word} meaning={obj.meaning} />
        ))
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center' }}>No items to display</Box>
      )}
    </Box>

  </Box>
</Layout> */}

