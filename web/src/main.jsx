import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticlesPage from './pages/articles.jsx'
import ArticleDetailPage from './pages/articleDetail.jsx';
import AppContext from './utils/context.jsx';
import ImportantVocabulary from './pages/savedVocab.jsx';
import About from './pages/about.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
//   components: {
//     MuiSnackbarContent: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'red', // Customize globally
//         },
//       },
//     },
//   },
// });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: 'top',   
        horizontal: 'right' 
      }}>
     <AppContext>

        <Router>
      <Routes>
        {/* Define Routes for your pages */}
        <Route path="/" element={<ArticlesPage />} />
        <Route path="/saved_words" element={<ImportantVocabulary/>} />
        <Route path="/about" element={<About/>} />

        <Route path="/article/:id" element={<ArticleDetailPage />} />
      </Routes>
    </Router>
    </AppContext>
    </SnackbarProvider>
    {/* </ThemeProvider> */}
  </StrictMode>,
)
