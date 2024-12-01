import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import CreateText from './CreateText';
import Text from './Text';
import '../styles/text.css';
import { formatDate } from '../utils/dateUtils';

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
          <h2>Texts</h2>
          <button 
            onClick={() => setIsCreating(true)} 
            className="create-text-btn"
          >
            Create New Text
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="text-list">
          {texts.map((text) => (
            <div
              key={text.id}
              className={`text-item ${selectedText && selectedText.id === text.id ? 'selected' : ''}`}
              onClick={() => handleTextClick(text)}
            >
              <div className="text-info">
                <span className="text-title">{text.title}</span>
                <div className="text-details">
                  <span className="text-language">
                    {getLanguageDisplay(text.language)}
                  </span>
                  <span className="text-date">{formatDate(text.createdAt)}</span>
                </div>
              </div>
              <button
                className="delete-text-btn"
                onClick={(e) => handleDeleteText(text.id, e)}
                title="Delete text"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="text-content-area">
        {selectedText && (
          <Text
            text={selectedText}
            onDelete={handleDeleteText}
            onUpdate={handleTextUpdated}
          />
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
