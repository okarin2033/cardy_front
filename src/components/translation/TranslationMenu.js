import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { translateWord, getSupportedLanguages, LANGUAGES } from '../../services/translationService';
import { useUserSettings } from '../../hooks/useUserSettings';
import '../../styles/translation/translation-menu.css';

const TranslationMenu = ({ word, position, textLanguage = LANGUAGES.JAPANESE, onClose, onShowDetails }) => {
  console.log('Initial textLanguage:', textLanguage);
  
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);
  const [sourceLang, setSourceLang] = useState(LANGUAGES.JAPANESE);
  const [targetLang, setTargetLang] = useState(LANGUAGES.RUSSIAN);
  const [showSourceLangMenu, setShowSourceLangMenu] = useState(false);
  const [showTargetLangMenu, setShowTargetLangMenu] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const menuRef = useRef(null);
  const { settings } = useUserSettings();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const langs = await getSupportedLanguages();
      setLanguages(langs);
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const translate = async () => {
      if (!word) return;
      
      try {
        setLoading(true);
        const result = await translateWord(word, sourceLang, targetLang);
        setTranslation(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslation('Ошибка перевода');
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [word, sourceLang, targetLang]);

  useEffect(() => {
    if (textLanguage) {
      console.log('Setting source language:', textLanguage);
      setSourceLang(textLanguage);
    }
  }, [textLanguage]);

  const getLanguageDisplay = (langCode) => {
    console.log('Language code:', langCode, 'Type:', typeof langCode);
    
    if (!langCode) return 'XX';
    
    // Если это объект с code
    if (langCode && typeof langCode === 'object' && langCode.code) {
      return langCode.code.slice(0, 2).toUpperCase();
    }

    // Если это строка
    if (typeof langCode === 'string') {
      return langCode.slice(0, 2).toUpperCase();
    }

    // Ищем в списке языков
    const lang = languages.find(l => l.code === langCode);
    if (lang && lang.value) {
      return lang.value.slice(0, 2).toUpperCase();
    }

    return 'XX';
  };

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails();
    }
    onClose();
  };

  const handleAddToFavorites = () => {
    // TODO: Добавить логику добавления в избранное
    console.log('Adding to favorites:', { word, translation });
  };

  if (!word || word.length > 200) return null;

  // Не показываем меню, если нет валидной позиции
  if (!position?.x || !position?.y) return null;

  const menuContent = (
    <div 
      className="translation-menu" 
      ref={menuRef} 
      style={{ 
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)' // центрируем по горизонтали и сдвигаем вверх
      }}
    >
      {loading ? (
        <div className="translation-loading">Загрузка...</div>
      ) : (
        <div className="translation-content">
          <div className="text-row">
            <div className="text-content">{word}</div>
            <div className="language-selector">
              <button 
                className="language-button"
                onClick={() => {
                  setShowSourceLangMenu(!showSourceLangMenu);
                  setShowTargetLangMenu(false);
                }}
              >
                {getLanguageDisplay(sourceLang)}
              </button>
              {showSourceLangMenu && (
                <div className="language-dropdown">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className="language-option"
                      onClick={() => {
                        setSourceLang(lang);
                        setShowSourceLangMenu(false);
                      }}
                    >
                      {lang.value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-row">
            <div className="text-content">{translation}</div>
            <div className="language-selector">
              <button 
                className="language-button"
                onClick={() => {
                  setShowTargetLangMenu(!showTargetLangMenu);
                  setShowSourceLangMenu(false);
                }}
              >
                {getLanguageDisplay(targetLang)}
              </button>
              {showTargetLangMenu && (
                <div className="language-dropdown">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className="language-option"
                      onClick={() => {
                        setTargetLang(lang);
                        setShowTargetLangMenu(false);
                      }}
                    >
                      {lang.value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="translation-actions">
        <button 
          className="translation-action-button" 
          onClick={handleAddToFavorites}
          title="В избранное"
        >
          <span className="button-icon">♡</span>
          В избранное
        </button>
        <button 
          className="translation-action-button" 
          onClick={handleShowDetails}
          title="Подробно"
        >
          Подробно
          <span className="button-icon">→</span>
        </button>
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
};

export default TranslationMenu;
