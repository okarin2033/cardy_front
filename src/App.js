// src/App.js
import React, { useState, useContext } from 'react';
import DeckList from './components/DeckList';
import CardList from './components/CardList';
import Review from './components/Review';
import Profile from './components/Profile';
import './App.css';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const { auth } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSelectDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setCurrentTab('deck');
  };

  const handleReviewDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setIsLearningMode(false);
    setCurrentTab('review');
  };

  const handleLearnDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setIsLearningMode(true);
    setCurrentTab('review');
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <nav className="navbar">
        <ul>
          <li>
            <button
              className={currentTab === 'home' ? 'active' : ''}
              onClick={() => setCurrentTab('home')}
            >
              Главная
            </button>
          </li>
          <li>
            <button
              className={currentTab === 'profile' ? 'active' : ''}
              onClick={() => setCurrentTab('profile')}
            >
              Профиль
            </button>
          </li>
          <li className="theme-toggle">
            <button onClick={toggleTheme}>
              {isDarkMode ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
          </li>
        </ul>
      </nav>

      {currentTab === 'home' && auth.isAuthenticated && (
        <DeckList
          onSelectDeck={handleSelectDeck}
          onReviewDeck={handleReviewDeck}
          onLearnDeck={handleLearnDeck}
        />
      )}
      {currentTab === 'home' && !auth.isAuthenticated && (
        <div className="welcome-message">
          <h2>Добро пожаловать! Пожалуйста, войдите или зарегистрируйтесь.</h2>
        </div>
      )}
      {currentTab === 'profile' && (
        <Profile />
      )}
      {currentTab === 'deck' && selectedDeckId !== null && (
        <div>
          <CardList 
            deckId={selectedDeckId} 
            onStartReview={() => handleReviewDeck(selectedDeckId)}
            onStartLearning={() => handleLearnDeck(selectedDeckId)}
            onBack={() => setCurrentTab('home')}
          />
        </div>
      )}
      {currentTab === 'review' && selectedDeckId !== null && (
        <Review
          deckId={selectedDeckId}
          isLearningMode={isLearningMode}
          onFinish={() => setCurrentTab('deck')}
        />
      )}
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
