import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const CardItem = ({ card, onDelete }) => {
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 0.6) return 'var(--success-color)';
    if (difficulty <= 2.5) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const formatNextReview = (nextReview) => {
    const reviewDate = new Date(nextReview);
    const now = new Date();
    const diffTime = reviewDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMonths = Math.floor(diffDays / 30);
    
    // Если дата в прошлом
    if (diffTime < 0) {
      return { text: 'На повторение', isOverdue: true };
    }

    // В пределах 2 дней - показываем часы
    if (diffDays <= 2) {
      if (diffHours === 0) {
        return { text: 'Менее часа', isOverdue: false };
      } else if (diffHours === 1) {
        return { text: 'Через час', isOverdue: false };
      } else {
        const hours = diffHours % 24;
        const days = Math.floor(diffHours / 24);
        
        if (days === 0) {
          return { text: `Через ${hours} ${formatHours(hours)}`, isOverdue: false };
        } else {
          return { 
            text: `Через ${days} ${formatDays(days)} ${hours} ${formatHours(hours)}`,
            isOverdue: false 
          };
        }
      }
    }
    
    // Более 2 месяцев - показываем в месяцах
    if (diffMonths >= 2) {
      return { text: `Через ${diffMonths} ${formatMonths(diffMonths)}`, isOverdue: false };
    }
    
    // Иначе показываем в днях
    return { text: `Через ${diffDays} ${formatDays(diffDays)}`, isOverdue: false };
  };

  const formatHours = (hours) => {
    if (hours === 1) return 'час';
    if (hours >= 2 && hours <= 4) return 'часа';
    return 'часов';
  };

  const formatDays = (days) => {
    if (days === 1) return 'день';
    if (days >= 2 && days <= 4) return 'дня';
    return 'дней';
  };

  const formatMonths = (months) => {
    if (months === 1) return 'месяц';
    if (months >= 2 && months <= 4) return 'месяца';
    return 'месяцев';
  };

  const formatStability = (stability) => {
    // stability в днях
    if (stability <= 1) return 'Низкая';
    if (stability <= 15) return 'Средняя';
    return 'Высокая';
  };

  const getDifficultyText = (difficulty) => {
    if (difficulty < 0.6) return 'Легкая';
    if (difficulty <= 2.5) return 'Средняя';
    return 'Сложная';
  };

  return (
    <div className={`card-item ${card.isNew ? 'new-card' : ''}`}>
      <div className="card-actions">
        <button 
          onClick={() => onDelete(card.cardId)}
          className="delete-button"
          aria-label="Удалить карточку"
        >
          ✕
        </button>
      </div>

      <div className="card-content">
        <div className="card-text">
          <h4>{card.front}</h4>
          <p>{card.back}</p>
          {card.hint && <p className="hint">Подсказка: {card.hint}</p>}
        </div>

        <div className="card-progress">
          <div 
            className="difficulty-indicator"
            style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
            data-tooltip-id="tooltip"
            data-tooltip-content={`Сложность: ${getDifficultyText(card.difficulty)} (${card.difficulty.toFixed(1)} из 10)`}
          />

          <div className="progress-info">
            <span 
              className={`next-review ${formatNextReview(card.nextReview).isOverdue ? 'overdue' : ''}`}
              data-tooltip-id="tooltip"
              data-tooltip-content={`Следующее повторение: ${new Date(card.nextReview).toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}`}
            >
              {formatNextReview(card.nextReview).text}
            </span>

            <span 
              className="stability"
              data-tooltip-id="tooltip"
              data-tooltip-content={`Стабильность знания: ${card.stability.toFixed(1)} дней`}
            >
              {formatStability(card.stability)}
            </span>
          </div>
        </div>
      </div>
      <Tooltip id="tooltip" place="top" />
    </div>
  );
};

export default CardItem;