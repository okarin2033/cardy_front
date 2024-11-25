import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardList = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' });

  useEffect(() => {
    // Получение всех карточек для указанной колоды
    axios.get(`http://localhost:8080/v1/cards/deck/${deckId}`)
      .then(response => setCards(response.data))
      .catch(error => console.error('Ошибка при получении карточек:', error));
  }, [deckId]);

  const createCard = () => {
    if (!newCard.front || !newCard.back) return;

    const cardToCreate = {
      ...newCard,
      deck: { id: deckId } // Передача deck как вложенного объекта
    };

    axios.post('http://localhost:8080/v1/cards', cardToCreate)
      .then(response => setCards([...cards, response.data]))
      .catch(error => console.error('Ошибка при создании карточки:', error));

    setNewCard({ front: '', back: '', hint: '' });
  };

  const deleteCard = (id) => {
    axios.delete(`http://localhost:8080/v1/cards/${id}`)
      .then(() => setCards(cards.filter(card => card.id !== id)))
      .catch(error => console.error('Ошибка при удалении карточки:', error));
  };

  return (
    <div>
      <h3>Карточки</h3>
      <input
        type="text"
        value={newCard.front}
        onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
        placeholder="Front"
      />
      <input
        type="text"
        value={newCard.back}
        onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
        placeholder="Back"
      />
      <input
        type="text"
        value={newCard.hint}
        onChange={(e) => setNewCard({ ...newCard, hint: e.target.value })}
        placeholder="Hint"
      />
      <button onClick={createCard}>Создать карточку</button>
      <ul>
        {cards.map(card => (
          <li key={card.id}>
            {card.front} - {card.back}
            <button onClick={() => deleteCard(card.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;
