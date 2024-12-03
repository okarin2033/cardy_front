// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import DeckList from './components/deck/DeckList';
import CardList from './components/cards/CardList';
import Review from './components/cards/Review';
import Profile from './components/Profile';
import TextList from './components/texts/TextList';
import './App.css';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SlidePanelProvider } from './context/SlidePanelContext';

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
          {auth.isAuthenticated && (
            <li>
              <Link to="/texts" className={location.pathname === '/texts' ? 'active' : ''}>
                Тексты
              </Link>
            </li>
          )}
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Профиль
            </Link>
          </li>
        </ul>
      </nav>

      <div className="app-content">
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
          <Route path="/texts" element={<TextList />} />
          <Route path="/deck/:deckId" element={<CardList />} />
          <Route path="/deck/:deckId/review" element={<Review />} />
          <Route path="/deck/:deckId/learn" element={<Review />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <SlidePanelProvider>
        <AppContent />
      </SlidePanelProvider>
    </ThemeProvider>
  );
};

export default App;
