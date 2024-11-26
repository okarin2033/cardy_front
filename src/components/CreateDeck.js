// src/components/CreateDeck.js
import React, { useState, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';

const CreateDeck = ({ onDeckCreated, onCancel }) => {
  const { auth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название коллекции не может быть пустым');
      return;
    }

    try {
      const response = await axios.post('/decks', { 
        name: name.trim(),
      });
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
