import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticlesPage from './pages/articles.jsx'
import ArticleDetailPage from './pages/articleDetail.jsx';
import AppContext from './utils/context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AppContext>
        <Router>
      <Routes>
        {/* Define Routes for your pages */}
        <Route path="/" element={<ArticlesPage />} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
      </Routes>
    </Router>
    </AppContext>
  </StrictMode>,
)
