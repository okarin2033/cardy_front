// src/components/Review.js
import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import '../styles/review.css';

const Review = ({ deckId, onFinish }) => {
  const { auth } = useContext(AuthContext);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);

  // TODO: В будущем добавить поле language в модель колоды
  // и использовать его для определения, какой словарь показывать
  const isJapaneseDeck = true; // Временное решение, заменить на проверку языка колоды
  
  const getDictionaryUrl = (word) => {
    if (isJapaneseDeck) {
      return `https://jisho.org/search/${encodeURIComponent(word)}`;
    }
    // TODO: Добавить другие словари для разных языков
    return ''; // Временно возвращаем пустую строку для других языков
  };

  useEffect(() => {
    fetchCardsForReview();
    // eslint-disable-next-line
  }, [deckId]);

  const fetchCardsForReview = async () => {
    try {
      const response = await axios.get('/review/cards', {
        params: {
          deckId: deckId,
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
      await axios.post('/review/cards', {
        userCardId: currentCard.cardId,
        action: action,
      });

      if (currentCardIndex + 1 < cardsToReview.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(false);
        setShowHint(false);
        setAiExplanation(''); // Сбрасываем объяснение ИИ при переходе к следующей карточке
      } else {
        alert('Вы завершили повторение карточек!');
        onFinish();
      }
    } catch (error) {
      console.error('Ошибка при отправке результата повторения:', error);
      setError('Ошибка при отправке результата повторения');
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const getAiExplanation = async () => {
    setShowDictionary(false); // Закрываем словарь при запросе объяснения ИИ
    const currentCard = cardsToReview[currentCardIndex];
    setIsLoadingAi(true);
    try {
      const response = await axios.get('/api/ai/translate', {
        params: {
          word: currentCard.front,
          language: 'ru'
        }
      });
      
      // Форматируем текст, заменяя маркеры на HTML
      const formattedText = response.data
        .split('\n')
        .map(line => {
          if (line.startsWith('##') && !line.startsWith('###')) {
            return `<h2>${line.replace('##', '').trim()}</h2>`;
          }
          if (line.startsWith('###')) {
            return `<h3>${line.replace('###', '').trim()}</h3>`;
          }
          return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        })
        .join('<br>');

      setAiExplanation(formattedText);
    } catch (error) {
      console.error('Ошибка при получении объяснения от ИИ:', error);
      setError('Не удалось получить объяснение от ИИ');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const closeAiExplanation = () => {
    setAiExplanation('');
  };

  const closeDictionary = () => {
    setShowDictionary(false);
  };

  const openDictionary = () => {
    setAiExplanation(''); // Закрываем объяснение ИИ при открытии словаря
    setShowDictionary(true);
  };

  if (cardsToReview.length === 0) {
    return (
      <div>
        <h3>Нет карточек для повторения в этой колоде</h3>
        <button onClick={onFinish} className="review-back-button">
          <i className="fas fa-arrow-left"></i> Вернуться к колоде
        </button>
      </div>
    );
  }

  const currentCard = cardsToReview[currentCardIndex];

  return (
    <div className="review-container">
      <div className="review-content">
        <button onClick={onFinish} className="review-back-button">
          <i className="fas fa-arrow-left"></i> Вернуться к колоде
        </button>
        <h3>Повторение карточек</h3>
        {error && <div className="error-message">{error}</div>}
        
        <div className="review-card" onClick={() => setShowBack(!showBack)}>
          <div className="review-card-content">
            <div className="review-card-text">
              {showBack ? currentCard.back : currentCard.front}
            </div>
            {currentCard.hint && !showBack && (
              <div className="review-hint">
                {showHint ? (
                  <span>{currentCard.hint}</span>
                ) : (
                  <button 
                    className="review-hint-button" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleHint(); 
                    }}
                  >
                    <i className="fas fa-lightbulb"></i>
                  </button>
                )}
              </div>
            )}
          </div>

          {showBack && (
            <div className="review-ai-section" onClick={e => e.stopPropagation()}>
              {!aiExplanation && !showDictionary && (
                <>
                  <button 
                    className="review-ai-button"
                    onClick={getAiExplanation}
                    disabled={isLoadingAi}
                  >
                    {isLoadingAi ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <><i className="fas fa-robot"></i> Получить объяснение от ИИ</>
                    )}
                  </button>
                  {isJapaneseDeck && (
                    <button 
                      className="review-dictionary-button"
                      onClick={openDictionary}
                    >
                      <i className="fas fa-book"></i> Открыть словарь
                    </button>
                  )}
                </>
              )}
              {aiExplanation && (
                <div className="review-ai-explanation-container">
                  <button 
                    className="review-ai-close-button"
                    onClick={closeAiExplanation}
                    title="Закрыть объяснение"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <div 
                    className="review-ai-explanation"
                    dangerouslySetInnerHTML={{ __html: aiExplanation }}
                  />
                </div>
              )}
              {showDictionary && (
                <div className="review-dictionary-container">
                  <button 
                    className="review-dictionary-close-button"
                    onClick={closeDictionary}
                    title="Закрыть словарь"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <div className="review-dictionary-content">
                    <iframe
                      src={getDictionaryUrl(currentCard.front)}
                      className="review-dictionary-frame"
                      title="Dictionary"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="review-progress">
          Карточка {currentCardIndex + 1} из {cardsToReview.length}
        </div>

        <div className="review-actions">
          <button 
            onClick={() => handleReviewAction('AGAIN')}
            className="review-again-button"
          >
            Повторить
          </button>
          <button 
            onClick={() => handleReviewAction('HARD')}
            className="review-hard-button"
          >
            Трудно
          </button>
          <button 
            onClick={() => handleReviewAction('GOOD')}
            className="review-good-button"
          >
            Хорошо
          </button>
          <button 
            onClick={() => handleReviewAction('EASY')}
            className="review-easy-button"
          >
            Легко
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
