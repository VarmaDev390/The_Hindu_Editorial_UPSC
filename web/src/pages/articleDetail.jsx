import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import Layout from '../components/layout';

const ArticleDetailPage = () => {
  // Extracting title, summary, and full content from props
  const { title, summary, full_content, published_date } = data;

  return (
    <Layout>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
              Published on: {published_date}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" paragraph>
                {summary}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Full Content
              </Typography>
              <Typography variant="body1" paragraph>
                {full_content}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ArticleDetailPage;
