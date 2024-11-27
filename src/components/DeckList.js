// src/components/DeckList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import CreateDeck from './CreateDeck';
import { AuthContext } from '../context/AuthContext';

const DeckList = ({ onSelectDeck, onReviewDeck }) => {
  const [decks, setDecks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  const fetchDecks = async () => {
    try {
      const response = await axios.get('/decks');
      setDecks(response.data);
    } catch (error) {
      setError('Ошибка при загрузке коллекций');
      console.error('Error fetching decks:', error);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchDecks();
    }
  }, [auth.isAuthenticated]);

  const handleDeckCreated = (newDeck) => {
    fetchDecks(); // Обновляем список после создания
    setIsCreating(false);
  };

  const handleDeleteDeck = async (id) => {
    try {
      await axios.delete(`/decks/${id}`);
      fetchDecks(); // Обновляем список после удаления
    } catch (error) {
      setError('Ошибка при удалении коллекции');
      console.error('Error deleting deck:', error);
    }
  };

  if (isCreating) {
    return (
      <CreateDeck
        onDeckCreated={handleDeckCreated}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  return (
    <div className="deck-list">
      <h2>Мои коллекции</h2>
      {error && <div className="error-message">{error}</div>}
      <button className="create-button" onClick={() => setIsCreating(true)}>
        Создать новую коллекцию
      </button>
      <div className="decks-grid">
        {decks.map(deck => (
          <div key={deck.id} className="deck-card">
            <h3>{deck.name}</h3>
            <p>Количество карточек: {deck.count}</p>
            <p className={deck.needReview > 0 ? "need-review" : "all-reviewed"}>
              {deck.needReview > 0 ? '🔄' : '✓'} 
              {deck.needReview > 0 
                ? <span className="review-count">{deck.needReview} нуждаются в повторении</span>
                : 'Все карточки повторены'
              }
            </p>
            <div className="deck-actions">
              <button className="open-button" onClick={() => onSelectDeck(deck.id)}>Открыть</button>
              <button 
                className="repeat-button" 
                onClick={() => onReviewDeck(deck.id)}
                disabled={deck.needReview === 0}
              >
                Повторить
              </button>
              <button className="delete-button" onClick={() => handleDeleteDeck(deck.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckList;
