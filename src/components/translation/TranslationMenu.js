import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import '../../styles/translation/translation-menu.css';

const TranslationMenu = ({ word, position, onClose }) => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (word) {
        try {
          const response = await axios.get('/translate', {
            params: {
              text: word,
              sourceLang: 'JAPANESE',
              targetLang: 'RUSSIAN'
            }
          });
          setTranslation(response.data[0] || 'Перевод не найден');
        } catch (error) {
          console.error('Translation error:', error);
          setTranslation('Ошибка перевода');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTranslation();
  }, [word]);

  if (!word) return null;

  const style = {
    position: 'fixed',
    top: position.y,
    left: position.x,
  };

  return (
    <div className="translation-menu" style={style}>
      {loading ? (
        <div className="translation-loading">Загрузка...</div>
      ) : (
        <div className="translation-content">
          <div className="original-word">{word}</div>
          <div className="translation-text">{translation}</div>
        </div>
      )}
    </div>
  );
};

export default TranslationMenu;
