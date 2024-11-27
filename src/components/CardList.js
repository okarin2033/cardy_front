// src/components/CardList.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import DeckNavigation from './DeckNavigation';

const CardList = ({ deckId, onStartReview, onBack }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewCount, setReviewCount] = useState(0);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`/cards/deck/${deckId}`);
      setCards(response.data);
      const reviewResponse = await axios.get(`/cards/deck/${deckId}/review-count`);
      setReviewCount(reviewResponse.data.count);
    } catch (error) {
      console.error('Ошибка при получении карточек:', error);
      setError('Ошибка при получении карточек');
    }
  };

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front || !newCard.back) {
      setError('Поля "Слово" и "Перевод" обязательны для заполнения');
      return;
    }

    try {
      await axios.post('/cards', {
        ...newCard,
        deckId: deckId
      });
      setNewCard({ front: '', back: '', hint: '' });
      fetchCards();
      setError('');
    } catch (error) {
      console.error('Ошибка при создании карточки:', error);
      setError('Ошибка при создании карточки');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`/cards/${cardId}`);
      fetchCards();
    } catch (error) {
      console.error('Ошибка при удалении карточки:', error);
      setError('Ошибка при удалении карточки');
    }
  };

  const filteredCards = cards.filter(card =>
    card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.hint?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card-list">
      <DeckNavigation 
        onBack={onBack} 
        onStartReview={onStartReview} 
        reviewCount={reviewCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="card-form">
        <h3>Добавить карточку</h3>
        <form onSubmit={handleAddCard}>
          <input
            type="text"
            name="front"
            value={newCard.front}
            onChange={handleInputChange}
            placeholder="Слово"
          />
          <input
            type="text"
            name="back"
            value={newCard.back}
            onChange={handleInputChange}
            placeholder="Перевод"
          />
          <input
            type="text"
            name="hint"
            value={newCard.hint}
            onChange={handleInputChange}
            placeholder="Подсказка (необязательно)"
          />
          <button type="submit">Добавить</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="cards-grid">
        {filteredCards.map(card => (
          <div key={card.id} className="card-item">
            <div className="card-content">
              <h4>{card.front}</h4>
              <p>{card.back}</p>
              {card.hint && <p className="hint">Подсказка: {card.hint}</p>}
            </div>
            <div className="card-actions">
              <button onClick={() => handleDeleteCard(card.id)} className="delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
