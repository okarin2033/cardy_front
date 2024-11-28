// src/components/CardList.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig.js';
import DeckNavigation from './DeckNavigation.js';
import CardControls from './CardControls.js';
import CardItem from './CardItem.js';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../types/cards.js';
import '../styles/card.css';

const CardList = ({ deckId, onStartReview, onBack }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' });
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedCards, setSelectedCards] = useState(new Set());

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/cards/deck/${deckId}/user`);
      setCards(response.data);
      const reviewResponse = await axios.get(`/cards/deck/${deckId}/review-count`);
      setReviewCount(reviewResponse.data.count);
    } catch (error) {
      console.error('Ошибка при получении карточек:', error);
      setError('Ошибка при получении карточек');
    } finally {
      setIsLoading(false);
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
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      fetchCards();
    } catch (error) {
      console.error('Ошибка при удалении карточки:', error);
      setError('Ошибка при удалении карточки');
    }
  };

  const handleSelectCard = (cardId) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedCards.size === filteredCards.length) {
      // Если все карточки выбраны, снимаем выделение
      setSelectedCards(new Set());
    } else {
      // Иначе выбираем все карточки
      setSelectedCards(new Set(filteredCards.map(card => card.cardId)));
    }
  };

  const filterCards = (cards) => {
    let filtered = [...cards];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.front.toLowerCase().includes(query) || 
        card.back.toLowerCase().includes(query) ||
        (card.hint && card.hint.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'new':
        filtered = filtered.filter(card => card.isNew);
        break;
      case 'review':
        filtered = filtered.filter(card => new Date(card.nextReview) <= new Date());
        break;
      case 'easy':
        filtered = filtered.filter(card => card.difficulty < 0.3);
        break;
      case 'medium':
        filtered = filtered.filter(card => card.difficulty >= 0.3 && card.difficulty < 0.7);
        break;
      case 'hard':
        filtered = filtered.filter(card => card.difficulty >= 0.7);
        break;
      default:
        break;
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'nextReview') {
          return new Date(a[sortBy]) - new Date(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
      });
    }

    return filtered;
  };

  const filteredCards = filterCards(cards);

  return (
    <div className="card-list">
      <DeckNavigation 
        onBack={onBack} 
        onStartReview={onStartReview} 
        reviewCount={reviewCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CardControls
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={(newFilter) => {
          setFilterBy(newFilter);
          setSelectedCards(new Set()); // Сбрасываем выбор при изменении фильтра
        }}
      />

      {filteredCards.length > 0 && (
        <div className="card-selection-controls">
          <label className="select-all-container">
            <input
              type="checkbox"
              checked={selectedCards.size === filteredCards.length && filteredCards.length > 0}
              onChange={handleSelectAll}
            />
            Выбрать все ({selectedCards.size} из {filteredCards.length})
          </label>
        </div>
      )}

      <div className="card-form">
        <h3>Добавить карточку</h3>
        <form onSubmit={handleAddCard} className="card-form-content">
          <div className="form-group">
            <label>Слово</label>
            <input
              type="text"
              name="front"
              value={newCard.front}
              onChange={handleInputChange}
              placeholder="Введите слово"
            />
          </div>
          <div className="form-group">
            <label>Перевод</label>
            <input
              type="text"
              name="back"
              value={newCard.back}
              onChange={handleInputChange}
              placeholder="Введите перевод"
            />
          </div>
          <div className="form-group">
            <label>Подсказка (необязательно)</label>
            <input
              type="text"
              name="hint"
              value={newCard.hint}
              onChange={handleInputChange}
              placeholder="Введите подсказку"
            />
          </div>
          <div className="form-group">
            <button type="submit">Добавить</button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      {isLoading ? (
        <div className="loading">Загрузка карточек...</div>
      ) : (
        <>
          <div className="cards-container">
            {filteredCards.length === 0 ? (
              <div className="no-cards">
                {filterBy !== 'all' 
                  ? 'Нет карточек, соответствующих фильтрам' 
                  : 'Карточки не найдены'}
              </div>
            ) : (
              filteredCards.map(card => (
                <CardItem
                  key={card.cardId}
                  card={card}
                  onDelete={handleDeleteCard}
                  isSelected={selectedCards.has(card.cardId)}
                  onSelect={() => handleSelectCard(card.cardId)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardList;
