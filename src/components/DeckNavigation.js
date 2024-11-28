import React from 'react';

const DeckNavigation = ({ 
  onBack, 
  onStartReview, 
  onStartLearning, 
  reviewCount, 
  newCardsCount, 
  searchQuery, 
  onSearchChange,
  showAddCard,
  onToggleAddCard
}) => {
  return (
    <div className="deck-nav">
      <div className="deck-nav-left">
        <button onClick={onBack}>Назад к коллекциям</button>
        {newCardsCount > 0 && (
          <button onClick={onStartLearning}>
            Учить {newCardsCount > 0 && `(${newCardsCount})`}
          </button>
        )}
        <button 
          onClick={onStartReview} 
          disabled={reviewCount === 0}
        >
          Начать повторение {reviewCount > 0 && `(${reviewCount})`}
        </button>
        <button 
          onClick={onToggleAddCard}
          className={`add-card-button ${showAddCard ? 'active' : ''}`}
        >
          Добавить карточку
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
