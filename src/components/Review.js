import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Review = ({ deckId, userId, onFinish }) => {
  const [cardsToReview, setCardsToReview] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCardsForReview();
    // eslint-disable-next-line
  }, [deckId, userId]);

  const fetchCardsForReview = async () => {
    try {
      const response = await axios.get('http://localhost:8080/v1/review/cards', {
        params: {
          deckId: deckId,
          userId: userId,
        },
      });
      setCardsToReview(response.data);
    } catch (error) {
      console.error('Ошибка при получении карточек для повторения:', error);
      setError('Ошибка при получении карточек для повторения');
    }
  };

  const handleReviewAction = async (action) => {
    const currentCard = cardsToReview[currentCardIndex];

    try {
      await axios.post('http://localhost:8080/v1/review/cards', {
        userCardId: currentCard.cardId,
        action: action,
      });

      if (currentCardIndex + 1 < cardsToReview.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(false);
        setShowHint(false);
      } else {
        // Повторение закончено
        alert('Вы завершили повторение карточек!');
        onFinish(); // Возвращаемся на главную или куда необходимо
      }
    } catch (error) {
      console.error('Ошибка при отправке результата повторения:', error);
      setError('Ошибка при отправке результата повторения');
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  if (cardsToReview.length === 0) {
    return <div><h3>Нет карточек для повторения в этой колоде</h3></div>;
  }

  const currentCard = cardsToReview[currentCardIndex];

  return (
    <div className="review-container">
      <h3>Повторение карточек</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="card" onClick={() => setShowBack(!showBack)}>
        <div className="card-content">
          {showBack ? currentCard.back : currentCard.front}
        </div>
        {currentCard.hint && !showBack && (
          <div className="card-hint">
            {showHint ? (
              <span>{currentCard.hint}</span>
            ) : (
              <button className="hint-button" onClick={(e) => { e.stopPropagation(); toggleHint(); }}>
                ❓
              </button>
            )}
          </div>
        )}
      </div>
      {showBack && (
        <div className="review-actions">
          <button onClick={() => handleReviewAction('AGAIN')}>Повторить</button>
          <button onClick={() => handleReviewAction('HARD')}>Трудно</button>
          <button onClick={() => handleReviewAction('GOOD')}>Хорошо</button>
          <button onClick={() => handleReviewAction('EASY')}>Легко</button>
        </div>
      )}
      <div className="progress">
        Карточка {currentCardIndex + 1} из {cardsToReview.length}
      </div>
    </div>
  );
};

export default Review;
