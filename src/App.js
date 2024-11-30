// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import DeckList from './components/DeckList';
import CardList from './components/CardList';
import Review from './components/Review';
import Profile from './components/Profile';
import './App.css';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const { auth } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <nav className="navbar">
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {isDarkMode ? (
              <i className="fas fa-sun"></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </button>
        </div>
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Профиль
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              <DeckList
                onSelectDeck={(deckId) => navigate(`/deck/${deckId}`)}
                onReviewDeck={(deckId) => navigate(`/deck/${deckId}/review`)}
                onLearnDeck={(deckId) => navigate(`/deck/${deckId}/learn`)}
              />
            ) : (
              <div className="welcome-message">
                <h2>Добро пожаловать! Пожалуйста, войдите или зарегистрируйтесь.</h2>
              </div>
            )
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/deck/:deckId" element={<CardList />} />
        <Route path="/deck/:deckId/review" element={<Review />} />
        <Route path="/deck/:deckId/learn" element={<Review />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
