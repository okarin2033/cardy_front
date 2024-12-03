import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';

const TranslationContent = ({ text }) => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (text) {
        try {
          const response = await axios.get('/translate', {
            params: {
              text,
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
  }, [text]);

  if (loading) {
    return <p>Загрузка перевода...</p>;
  }

  return <p>{translation}</p>;
};

export default TranslationContent;
