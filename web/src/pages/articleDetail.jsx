import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid2, Box, Paper } from '@mui/material';
import Layout from '../components/layout';
import { useLocation } from 'react-router-dom';

const ArticleDetailPage = () => {
  // Extracting title, summary, and full content from props
  const location = useLocation();
  const { title, summary, full_content, published_date, Vocabulary } = location.state?.article;
  // const article = location.state?.article;
  // console.log("article",article)

  return (
    <Layout>
      <Grid2 container justifyContent="space-between"  spacing={2}>
        <Grid2  size={{ xs: 12, sm:8, md: 6 }}>
          {/* <Paper  sx={{ padding: 3 }}> */}
            <Typography variant="h4" gutterBottom align="center">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" >
              Published on: {published_date}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" >
                {summary}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Full Content
              </Typography>
              <Typography variant="body1" >
                {full_content}
              </Typography>
            </Box>
          {/* </Paper> */}
        </Grid2>
        <Grid2  size={{ xs: 12, sm:8, md: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
              Important Vocabulary
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
             
              <Typography variant="body1" >
                {Vocabulary}
              </Typography>
            </Box>
        </Grid2>
      </Grid2>
      {/* Ravi */}
    </Layout>
  );
};

export default ArticleDetailPage;
