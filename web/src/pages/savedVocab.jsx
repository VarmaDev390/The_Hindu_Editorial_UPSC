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

    const itemsPerPage = 10; // Number of items per page

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
            // console.log("iside fetch");
      
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
<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between"}}>


       <Box sx={{ marginBottom: 2 }}>
        {currentItems.map((obj, index) => (
          <VocabCard key={index} word={obj.word} meaning={obj.meaning} />
        ))}
      </Box>

      {/* Pagination Component */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(savedVocab.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      </Box>
    </Layout>  
    )
}

export default ImportantVocabulary;
