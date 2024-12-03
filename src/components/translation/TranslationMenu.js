import React, { useState, useEffect, useCallback } from 'react';
import { translateWord, getSupportedLanguages, LANGUAGES } from '../../services/translationService';
import { useUserSettings } from '../../hooks/useUserSettings';
import '../../styles/translation/translation-menu.css';

const TranslationMenu = ({ word, position, textLanguage = LANGUAGES.JAPANESE }) => {
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);
  const [sourceLang, setSourceLang] = useState(textLanguage);
  const [targetLang, setTargetLang] = useState(LANGUAGES.RUSSIAN);
  const [languages, setLanguages] = useState([]);
  const userSettings = useUserSettings();

  useEffect(() => {
    const loadLanguages = async () => {
      const supportedLangs = await getSupportedLanguages();
      setLanguages(supportedLangs);
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    setTargetLang(userSettings.targetLanguage);
  }, [userSettings.targetLanguage]);

  useEffect(() => {
    setSourceLang(textLanguage);
  }, [textLanguage]);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (word) {
        try {
          const result = await translateWord(word, targetLang, sourceLang);
          setTranslation(result && result[0] ? result[0] : 'Перевод не найден');
        } catch (error) {
          console.error('Translation error:', error);
          setTranslation('Ошибка перевода');
        } finally {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchTranslation();
  }, [word, sourceLang, targetLang]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(translation).then(() => {
      // Можно добавить уведомление о копировании
    });
  }, [translation]);

  const handleAddToFavorites = useCallback(() => {
    // Здесь будет логика добавления в избранное
  }, [word, translation]);

  const handleSourceLanguageChange = (event) => {
    setSourceLang(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLang(event.target.value);
  };

  if (!word) return null;

  const menuStyle = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
  };

  return (
    <div className="translation-menu" style={menuStyle}>
      {loading ? (
        <div className="translation-loading">Загрузка</div>
      ) : (
        <>
          <div className="translation-content">
            <div className="text-row">
              <div className="text-content">{word}</div>
              <select 
                className="language-select" 
                value={sourceLang} 
                onChange={handleSourceLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-row">
              <div className="text-content">{translation}</div>
              <select 
                className="language-select" 
                value={targetLang} 
                onChange={handleTargetLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="translation-actions">
            <button 
              className="translation-action-button" 
              onClick={handleCopy}
              title="Копировать перевод"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
              </svg>
              Копировать
            </button>
            <button 
              className="translation-action-button"
              onClick={handleAddToFavorites}
              title="Добавить в избранное"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              В избранное
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TranslationMenu;
