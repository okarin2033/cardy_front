import React from 'react';

const DeckNavigation = ({ onBack, onStartReview, reviewCount, searchQuery, onSearchChange }) => {
  return (
    <div className="deck-nav">
      <div className="deck-nav-left">
        <button onClick={onBack}>Назад к коллекциям</button>
        <button 
          onClick={onStartReview} 
          disabled={reviewCount === 0}
        >
          Начать повторение {reviewCount > 0 && `(${reviewCount})`}
        </button>
      </div>
      <div className="deck-nav-right">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск карточек..."
          className="search-input"
        />
      </div>
    </div>
  );
};

export default DeckNavigation;