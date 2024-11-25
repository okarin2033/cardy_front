import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateDeck from './CreateDeck';

const DeckList = ({ onSelectDeck }) => {
  const [decks, setDecks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchDecks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/v1/decks', {
        headers: {
          'User-ID': '0'
        }
      });
      setDecks(response.data);
    } catch (error) {
      setError('Ошибка при загрузке коллекций');
      console.error('Error fetching decks:', error);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

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
            <p>{deck.cards?.length || 0} карточек</p>
            <div className="deck-actions">
              <button onClick={() => onSelectDeck(deck.id)}>Открыть</button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteDeck(deck.id)}
              >
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
