import React, { useState, useEffect } from 'react';
import DeckList from './components/DeckList';
import CardList from './components/CardList';
import Review from './components/Review';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const userId = 0; // Используем userId=0 по умолчанию

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
      {currentTab === 'home' && (
        <DeckList
          userId={userId}
          onSelectDeck={handleSelectDeck}
          onReviewDeck={handleReviewDeck}
        />
      )}
      {currentTab === 'settings' && (
        <div className="settings">
          <h2>Настройки</h2>
          <p>Здесь будут настройки.</p>
        </div>
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
            userId={userId}
            onFinish={() => setCurrentTab('home')}
          />
        </div>
      )}
    </div>
  );
}

export default App;
