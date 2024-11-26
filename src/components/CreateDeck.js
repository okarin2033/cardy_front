import React, { useState } from 'react';
import axios from 'axios';

const CreateDeck = ({ onDeckCreated, onCancel, userId }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название коллекции не может быть пустым');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/v1/decks', 
        { 
          name: name.trim(),
          userId: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      onDeckCreated(response.data);
      onCancel(); // Закрываем форму после успешного создания
    } catch (error) {
      setError('Ошибка при создании коллекции: ' + (error.response?.data?.message || error.message));
      console.error('Error creating deck:', error);
    }
  };

  return (
    <div className="create-deck-form">
      <h2>Создание новой коллекции</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deckName">Название коллекции:</label>
          <input
            id="deckName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название коллекции"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-buttons">
          <button type="submit">Создать</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeck;
