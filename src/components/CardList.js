// src/components/CardList.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const CardList = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' });
  const [error, setError] = useState('');

  const fetchCards = async () => {
    try {
      const response = await axios.get(`/cards/deck/${deckId}`);
      setCards(response.data);
    } catch (error) {
      console.error('Ошибка при получении карточек:', error);
      setError('Ошибка при получении карточек');
    }
  };

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const createCard = async () => {
    if (!newCard.front || !newCard.back) {
      alert('Лицевая и обратная стороны карточки не могут быть пустыми');
      return;
    }

    const cardToCreate = {
      front: newCard.front,
      back: newCard.back,
      hint: newCard.hint,
      deckId: deckId,
    };

    try {
      const response = await axios.post('/cards', cardToCreate);
      setCards([...cards, response.data]);
      setNewCard({ front: '', back: '', hint: '' });
    } catch (error) {
      console.error('Ошибка при создании карточки:', error);
      setError('Ошибка при создании карточки');
    }
  };

  const deleteCard = async (id) => {
    try {
      await axios.delete(`/cards/${id}`);
      setCards(cards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении карточки:', error);
      setError('Ошибка при удалении карточки');
    }
  };

  return (
    <div className="card-list">
      <h3>Карточки</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="card-form">
        <input
          type="text"
          value={newCard.front}
          onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
          placeholder="Лицевая сторона"
        />
        <input
          type="text"
          value={newCard.back}
          onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
          placeholder="Обратная сторона"
        />
        <input
          type="text"
          value={newCard.hint}
          onChange={(e) => setNewCard({ ...newCard, hint: e.target.value })}
          placeholder="Подсказка (необязательно)"
        />
        <button onClick={createCard}>Создать карточку</button>
      </div>
      <div className="cards-grid">
        {cards.map(card => (
          <div key={card.id} className="card-item">
            <div className="card-content">
              <strong>{card.front}</strong>
              <p>{card.back}</p>
              {card.hint && <em>Подсказка: {card.hint}</em>}
            </div>
            <button className="delete-button" onClick={() => deleteCard(card.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardList;
