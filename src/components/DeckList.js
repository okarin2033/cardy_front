import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateDeck from './CreateDeck';
import Review from './Review';

const DeckList = ({ userId, onSelectDeck, onReviewDeck }) => {
  const [decks, setDecks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchDecks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/decks/by-user/${userId}`);
      setDecks(response.data);
    } catch (error) {
      setError('Ошибка при загрузке коллекций');
      console.error('Error fetching decks:', error);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [userId]);

  const handleDeckCreated = (newDeck) => {
    fetchDecks(); // Обновляем список после создания
    setIsCreating(false);
  };

  const handleDeleteDeck = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/v1/decks/${id}`);
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
        userId={userId}
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
            <p className="need-review">
              <span className="review-icon">🔄</span>
              {deck.needReview} нуждаются в повторении
            </p>
            <div className="deck-actions">
              <button className="open-button" onClick={() => onSelectDeck(deck.id)}>Открыть</button>
              <button className="repeat-button" onClick={() => onReviewDeck(deck.id)}>
                Повторить {deck.needReview > 0 && `(${deck.needReview})`}
              </button>
              <button className="delete-button" onClick={() => handleDeleteDeck(deck.id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckList;
