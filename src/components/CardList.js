// src/components/CardList.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig.js';
import DeckNavigation from './DeckNavigation.js';
import CardControls from './CardControls.js';
import CardItem from './CardItem.js';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../types/cards.js';
import '../styles/card.css';

const CardList = ({ deckId, onStartReview, onStartLearning, onBack }) => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' });
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);
  const [newCardsCount, setNewCardsCount] = useState(0);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [showAddCard, setShowAddCard] = useState(false);

  const fetchReviewCount = async () => {
    try {
      const response = await axios.get(`cards/deck/${deckId}/review-count`);
      setReviewCount(response.data.count);
    } catch (error) {
      console.error('Error fetching review count:', error);
    }
  };

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`cards/deck/${deckId}/user`);
      setCards(response.data);
      
      // Подсчитываем количество новых карточек
      const newCount = response.data.filter(card => card.new).length;
      setNewCardsCount(newCount);
      
      // Получаем актуальное количество карточек для повторения
      await fetchReviewCount();
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
      await axios.post('cards', {
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
      await axios.delete(`cards/${cardId}`);
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
        filtered = filtered.filter(card => card.new === true);
        break;
      case 'review':
        filtered = filtered.filter(card => new Date(card.nextReview) <= new Date());
        break;
      case 'easy':
        filtered = filtered.filter(card => card.difficulty < 0.6);
        break;
      case 'medium':
        filtered = filtered.filter(card => card.difficulty >= 0.6 && card.difficulty <= 2.5);
        break;
      case 'hard':
        filtered = filtered.filter(card => card.difficulty > 2.5);
        break;
      default:
        break;
    }

    // Apply custom sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'nextReview') {
          return new Date(a[sortBy]) - new Date(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
      });
    } else {
      // Default sorting: needs review (not new) -> new -> others by next review date
      filtered.sort((a, b) => {
        const now = new Date();
        const aReviewDate = new Date(a.nextReview);
        const bReviewDate = new Date(b.nextReview);
        const aNeedsReview = aReviewDate <= now && !a.new;
        const bNeedsReview = bReviewDate <= now && !b.new;

        // Сначала карточки для повторения (не new)
        if (aNeedsReview !== bNeedsReview) {
          return bNeedsReview ? 1 : -1;
        }

        // Потом новые карточки
        if (a.new !== b.new) {
          return b.new ? 1 : -1;
        }

        // Остальные сортируем по дате следующего повторения
        return aReviewDate - bReviewDate;
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
        onStartLearning={onStartLearning}
        reviewCount={reviewCount}
        newCardsCount={newCardsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showAddCard={showAddCard}
        onToggleAddCard={() => setShowAddCard(!showAddCard)}
      />

      <CardControls
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={(newFilter) => {
          setFilterBy(newFilter);
          setSelectedCards(new Set());
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

      {showAddCard && (
        <div className={`card-form ${showAddCard ? 'show' : ''}`}>
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
      )}

      <div className="cards-container">
        {isLoading ? (
          <div className="loading">Загрузка карточек...</div>
        ) : filteredCards.length > 0 ? (
          filteredCards.map(card => (
            <CardItem
              key={card.cardId}
              card={card}
              onDelete={() => handleDeleteCard(card.cardId)}
              selected={selectedCards.has(card.cardId)}
              onSelect={() => handleSelectCard(card.cardId)}
            />
          ))
        ) : (
          <div className="no-cards">Карточки не найдены</div>
        )}
      </div>
    </div>
  );
};

export default CardList;
