import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';
import { AuthContext } from '../context/AuthContext';
import '../styles/review.css';

const Review = ({ deckId, isLearningMode, onFinish }) => {
  const { auth } = useContext(AuthContext);
  const [cardsToReview, setCardsToReview] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [isJapaneseDeck, setIsJapaneseDeck] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [deckId, isLearningMode]);

  const fetchCards = async () => {
    setIsLoading(true);
    setHasData(false);
    try {
      const mode = isLearningMode ? 'mixed' : 'review_only';
      const response = await axios.get(`review/cards/study/${deckId}`, {
        params: { mode },
      });

      if (response.data.length > 0) {
        setCardsToReview(response.data);
        setShowBack(isLearningMode);
        setHasData(true);
      } else {
        onFinish();
      }
      setCurrentCardIndex(0);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Ошибка при получении карточек');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentCard = cardsToReview[currentCardIndex];
    
    try {
      if (isLearningMode && currentCard.mode === 'MIXED') {
        await axios.post('review/cards', {
          userCardId: currentCard.cardId,
          action: 'LEARN'
        });
      }

      if (currentCardIndex + 1 < cardsToReview.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(isLearningMode && cardsToReview[currentCardIndex + 1].mode === 'MIXED');
        setShowHint(false);
        setAiExplanation('');
        setShowDictionary(false);
      } else {
        onFinish();
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setError('Ошибка при обновлении карточки');
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const getAiExplanation = async () => {
    setShowDictionary(false);
    const currentCard = cardsToReview[currentCardIndex];
    setIsLoadingAi(true);
    try {
      const response = await axios.get('api/ai/translate', {
        params: {
          word: currentCard.front,
          language: 'ru'
        }
      });
      
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
    setAiExplanation('');
    setShowDictionary(true);
  };

  const getDictionaryUrl = (word) => {
    if (isJapaneseDeck && word) {
      return `https://jisho.org/search/${encodeURIComponent(word)}`;
    }
    return '';
  };

  const handleReviewAction = async (action) => {
    const currentCard = cardsToReview[currentCardIndex];
    
    try {
      await axios.post('review/cards', {
        userCardId: currentCard.cardId,
        action: action
      });

      if (currentCardIndex + 1 < cardsToReview.length) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(isLearningMode && cardsToReview[currentCardIndex + 1].mode === 'MIXED');
        setShowHint(false);
        setAiExplanation('');
        setShowDictionary(false);
      } else {
        onFinish();
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setError('Ошибка при обновлении карточки');
    }
  };

  if (isLoading) {
    return (
      <div className="review-container">
        <div className="review-header">
          <button onClick={onFinish} className="review-back-button">
            <i className="fas fa-arrow-left"></i> Вернуться к колоде
          </button>
        </div>
        <div>Загрузка карточек...</div>
      </div>
    );
  }

  if (!hasData && !isLoading) {
    return (
      <div className="review-container">
        <div className="review-header">
          <button onClick={onFinish} className="review-back-button">
            <i className="fas fa-arrow-left"></i> Вернуться к колоде
          </button>
        </div>
        <h3>Нет карточек для {isLearningMode ? 'изучения' : 'повторения'} в этой колоде</h3>
      </div>
    );
  }

  return (
    <div className="review-container">
      <div className="review-content">
        <button onClick={onFinish} className="review-back-button">
          <i className="fas fa-arrow-left"></i> Вернуться к колоде
        </button>
        
        <h3>{isLearningMode ? 'Изучение новых слов' : 'Повторение'}</h3>
        {error && <div className="error-message">{error}</div>}
        
        <div className={`review-card ${cardsToReview[currentCardIndex]?.mode === 'LEARN' ? 'learning-mode' : ''}`} 
             onClick={() => cardsToReview[currentCardIndex]?.mode === 'REVIEW' && setShowBack(!showBack)}>
          <div className="review-card-content">
            <div className="review-card-text">
              {(showBack || cardsToReview[currentCardIndex]?.mode === 'LEARN') ? (
                <>
                  <div className="review-card-front-small">{cardsToReview[currentCardIndex]?.front}</div>
                  <div className="review-card-back">{cardsToReview[currentCardIndex]?.back}</div>
                </>
              ) : (
                cardsToReview[currentCardIndex]?.front
              )}
            </div>
            
            {cardsToReview[currentCardIndex]?.mode === 'REVIEW' && cardsToReview[currentCardIndex]?.hint && !showBack && (
              <div className="review-hint">
                {showHint ? (
                  <span>{cardsToReview[currentCardIndex]?.hint}</span>
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

          {(showBack || cardsToReview[currentCardIndex]?.mode === 'LEARN') && (
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
                      src={getDictionaryUrl(cardsToReview[currentCardIndex]?.front)}
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
          {isLearningMode ? (
            <>Изучение карточки {currentCardIndex + 1} из {cardsToReview.length}</>
          ) : (
            <>Повторение карточки {currentCardIndex + 1} из {cardsToReview.length}</>
          )}
        </div>

        <div className="review-actions">
          {cardsToReview[currentCardIndex]?.mode === 'LEARN' ? (
            <button 
              onClick={handleNext}
              className="review-next-button"
            >
              {currentCardIndex + 1 < cardsToReview.length ? 'Следующая карточка' : 'Закончить'}
            </button>
          ) : (
            <>
              <button onClick={() => handleReviewAction('AGAIN')} className="review-again-button">
                Повторить
              </button>
              <button onClick={() => handleReviewAction('HARD')} className="review-hard-button">
                Трудно
              </button>
              <button onClick={() => handleReviewAction('GOOD')} className="review-good-button">
                Хорошо
              </button>
              <button onClick={() => handleReviewAction('EASY')} className="review-easy-button">
                Легко
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
