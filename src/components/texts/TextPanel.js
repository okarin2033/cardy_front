import React, { useState, useEffect } from 'react';
import { translateWord } from '../../services/translationService';
import '../../styles/text/text-panel.css';

const TextPanel = ({ selectedText }) => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await translateWord(selectedText, 'RUSSIAN');
      if (result && result.length > 0) {
        setTranslation(result[0]);
      } else {
        setTranslation('Перевод не найден');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Ошибка при переводе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-panel">
      <div className="text-panel-content">
        <div className="selected-content">
          <p>{selectedText || 'Выберите текст для перевода'}</p>
        </div>
        {translation && (
          <div className="text-panel-translation">
            <p>{translation}</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="action-buttons">
          <button 
            className="panel-button primary"
            onClick={handleTranslate}
            disabled={!selectedText || loading}
          >
            {loading ? 'Переводим...' : 'Перевести'}
          </button>
          <button className="panel-button">В избранное</button>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
