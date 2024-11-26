// src/App.js
import React, { useState, useContext } from 'react';
import DeckList from './components/DeckList';
import CardList from './components/CardList';
import Review from './components/Review';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import './App.css';
import { AuthContext } from './context/AuthContext';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const { auth } = useContext(AuthContext);

  const handleSelectDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setCurrentTab('deck');
  };

  const handleReviewDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setCurrentTab('review');
  };

  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'home' && auth.isAuthenticated && (
        <DeckList
          onSelectDeck={handleSelectDeck}
          onReviewDeck={handleReviewDeck}
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
          <button className="back-button" onClick={() => setCurrentTab('home')}>Назад к коллекциям</button>
          <CardList deckId={selectedDeckId} />
        </div>
      )}
      {currentTab === 'review' && selectedDeckId !== null && (
        <div>
          <button className="back-button" onClick={() => setCurrentTab('home')}>Назад к коллекциям</button>
          <Review
            deckId={selectedDeckId}
            onFinish={() => setCurrentTab('home')}
          />
        </div>
      )}
    </div>
  );
}

export default App;
