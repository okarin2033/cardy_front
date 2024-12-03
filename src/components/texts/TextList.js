import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import CreateText from './CreateText';
import Text from './Text';
import '../../styles/text/text-list.css';
import { formatDate } from '../../utils/dateUtils';

function TextList() {
  const [texts, setTexts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await axios.get('/texts');
      setTexts(response.data);
    } catch (error) {
      console.error('Error fetching texts:', error);
      setError('Failed to load texts');
    }
  };

  const fetchTextById = async (id) => {
    try {
      const response = await axios.get(`/texts/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching text details:', err);
      setError('Failed to load text details');
      return null;
    }
  };

  const handleTextCreated = (newText) => {
    setTexts([...texts, newText]);
    setIsCreating(false);
  };

  const handleTextUpdated = async (updatedText) => {
    try {
      setTexts(texts.map(text => 
        text.id === updatedText.id ? updatedText : text
      ));
      setSelectedText(updatedText);
    } catch (error) {
      console.error('Error updating text:', error);
      setError('Failed to update text');
    }
  };

  const handleDeleteText = async (textId, e) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await axios.delete(`/texts/${textId}`);
      setTexts(texts.filter(text => text.id !== textId));
      if (selectedText && selectedText.id === textId) {
        setSelectedText(null);
      }
    } catch (error) {
      console.error('Error deleting text:', error);
      setError('Failed to delete text');
    }
  };

  const handleTextClick = async (text) => {
    setLoading(true);
    const fullText = await fetchTextById(text.id);
    if (fullText) {
      setSelectedText(fullText);
    }
    setLoading(false);
  };

  const getLanguageDisplay = (lang) => {
    if (!lang) return '';
    if (typeof lang === 'string') return lang;
    return lang.name || lang.code || '';
  };

  return (
    <div className="text-container">
      <div className="text-navigation">
        <div className="text-header">
          <h2>Тексты</h2>
          <button
            className="create-text-btn"
            onClick={() => setIsCreating(true)}
            title="Добавить текст"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        {error && <div className="error-message">
          {error === 'Failed to load texts' ? 'Ошибка при загрузке текстов' :
           error === 'Failed to load text details' ? 'Ошибка при загрузке деталей текста' :
           error === 'Failed to update text' ? 'Ошибка при обновлении текста' :
           error === 'Failed to delete text' ? 'Ошибка при удалении текста' :
           error}
        </div>}
        <div className="text-list">
          {texts.length === 0 ? (
            <div className="no-texts-message">
              Нет добавленных текстов. Создайте новый текст, нажав кнопку "Добавить текст"
            </div>
          ) : (
            texts.map((text) => (
              <div
                key={text.id}
                className={`text-item ${selectedText && selectedText.id === text.id ? 'selected' : ''}`}
                onClick={() => handleTextClick(text)}
              >
                <div className="text-info">
                  <span className="text-title">{text.title}</span>
                  <div className="text-details">
                    <span className="text-language">
                      <i className="fas fa-language"></i>
                      {getLanguageDisplay(text.language) === 'english' ? 'Английский' :
                       getLanguageDisplay(text.language) === 'russian' ? 'Русский' :
                       getLanguageDisplay(text.language)}
                    </span>
                    <span className="text-date">
                      <i className="far fa-calendar-alt"></i>
                      {formatDate(text.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  className="delete-text-btn"
                  onClick={(e) => handleDeleteText(text.id, e)}
                  title="Удалить текст"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="text-content-area">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Загрузка...</span>
          </div>
        ) : selectedText ? (
          <Text
            text={selectedText}
            onDelete={handleDeleteText}
            onUpdate={handleTextUpdated}
          />
        ) : (
          <div className="no-text-selected">
            <i className="fas fa-book-open"></i>
            <p>Выберите текст из списка слева или создайте новый</p>
          </div>
        )}
      </div>
      {isCreating && (
        <CreateText
          onClose={() => setIsCreating(false)}
          onTextCreated={handleTextCreated}
        />
      )}
    </div>
  );
}

export default TextList;
