import React,{useState, useEffect} from 'react';
import { Typography, Grid2, Box, Paper, Button } from '@mui/material';
import Layout from '../components/layout';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import VocabCard from '../components/vocabCard';

const ImportantVocabulary = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savedVocab, setSavedVocab] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading state
            // console.log("iside fetch");
      
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/saved-vocab`, {
                    
                    userId: "ravi"
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

        <Box sx={{ marginBottom: 2 }}>
          {savedVocab.map((obj, index) => (

            <VocabCard word={obj.word} meaning={""} onDelete={() => []} onSave={() => {}}/>
          ))}
        </Box>
    
    </Layout>  
    )
}

export default ImportantVocabulary;
