import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid2, Box, Paper, Button } from '@mui/material';
import Layout from '../components/layout';

import { ContextApp } from '../utils/context';

const About = () => {
  const { userId, articles, setArticles } = useContext(ContextApp);

  return (
    <Layout>
      <Box sx={{ padding: 2}}>
        {/* Title Section */}
        <Typography variant="h4" gutterBottom>
          About This Application
        </Typography>
        
        {/* Description Section */}
        <Typography variant="body1" paragraph>
          This application allows users to read daily editorials from available newspapers. It offers a variety of features to enhance your reading experience, especially if you're keen on improving your vocabulary.
        </Typography>
        
        {/* Features List Section */}
        <Typography variant="h5" gutterBottom>
          Key Features:
        </Typography>
        <Paper sx={{ padding: 2, marginBottom: 3, backgroundColor:"inherit" , color: 'white' }}>
          <Typography variant="body1" paragraph>
            <strong>1. Read Daily Editorials:</strong> Stay up to date with daily editorials from various newspapers. The articles are provided in a summarized format for easier reading.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2. Filter Articles by Date:</strong> You can filter out articles by their date, helping you to view articles from a specific time range.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3. Article Summaries:</strong> Each article comes with a concise summary, allowing you to grasp the key points quickly.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4. Vocabulary Extraction:</strong> Difficult vocabulary is automatically extracted from the articles and displayed for your reference. You can learn the meanings of these words with ease.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>5. Save and Delete Vocabulary:</strong> You can save any difficult vocabulary for later review or delete any vocabulary from the list. Deleting a word will prevent it from appearing in future articles.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6. Navigate to Saved Vocabulary:</strong> Check your saved vocabulary and their meanings at any time. Use this feature to review or learn the meanings of saved words.
          </Typography>
        </Paper>

        {/* Action Section */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            How to Use:
          </Typography>
          <Typography variant="body1" paragraph>
            - Simply navigate through articles, explore summaries, and take note of challenging words. 
            - Save any words you wish to review later, and feel free to delete any words from your vocabulary list.
            - You can filter articles by date to find content from specific days.
          </Typography>
          {/* <Button
            variant="contained"
            color="primary"
            href="/saved_vocab"
            sx={{ marginTop: 2 }}
          >
            View Saved Vocabulary
          </Button> */}
        </Box>
      </Box>
    </Layout>
  );
};

export default About;
