import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import CreateText from './CreateText';
import '../styles/text.css';
import { formatDate } from '../utils/dateUtils';

function TextList() {
  const [texts, setTexts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await axios.get('/api/texts');
      setTexts(response.data);
    } catch (error) {
      console.error('Error fetching texts:', error);
      setError('Не удалось загрузить тексты');
    }
  };

  const handleTextCreated = (newText) => {
    setTexts([...texts, newText]);
  };

  const handleDeleteText = async (textId) => {
    try {
      await axios.delete(`/api/texts/${textId}`);
      setTexts(texts.filter(text => text.id !== textId));
      if (selectedText && selectedText.id === textId) {
        setSelectedText(null);
      }
    } catch (error) {
      console.error('Error deleting text:', error);
      setError('Не удалось удалить текст');
    }
  };

  return (
    <div className="text-navigation">
      <div className="text-list">
        <div className="text-header">
          <h2>Тексты</h2>
          <div className="text-actions">
            <button 
              onClick={() => setIsCreating(true)} 
              className="create-text-btn"
            >
              Создать новый текст
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="text-items">
          {texts.map((text) => (
            <div
              key={text.id}
              className={`text-item ${selectedText && selectedText.id === text.id ? 'selected' : ''}`}
              onClick={() => setSelectedText(text)}
            >
              <div className="text-info">
                <span className="text-title">{text.title}</span>
                <div className="text-details">
                  <span className="text-language">{text.language.value}</span>
                  <span className="text-date">{formatDate(text.createdAt)}</span>
                </div>
              </div>
              <button
                className="delete-text-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteText(text.id);
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
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
