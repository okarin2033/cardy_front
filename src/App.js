import React, { useState, useEffect } from 'react';
import DeckList from './components/DeckList';
import CardList from './components/CardList';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [lastCollection, setLastCollection] = useState(null);

  useEffect(() => {
    const storedLastCollection = localStorage.getItem('lastCollection');
    if (storedLastCollection) {
      setLastCollection(JSON.parse(storedLastCollection));
    }
  }, []);

  useEffect(() => {
    if (lastCollection) {
      localStorage.setItem('lastCollection', JSON.stringify(lastCollection));
    }
  }, [lastCollection]);

  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'home' && (
        <DeckList onSelectDeck={(id) => {
          setSelectedDeckId(id);
          setLastCollection(id);
          setCurrentTab('lastCollection');
        }} />
      )}
      {currentTab === 'settings' && (
        <div><h2>Настройки</h2><p>Здесь будут настройки.</p></div>
      )}
      {currentTab === 'lastCollection' && lastCollection !== null && (
        <div>
          <button onClick={() => setCurrentTab('home')}>Back to Home</button>
          <CardList deckId={lastCollection} />
        </div>
      )}
    </div>
  );
}

export default App;
