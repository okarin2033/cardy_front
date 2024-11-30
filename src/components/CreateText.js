import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import '../styles/common.css';

const CreateText = ({ onClose, onTextCreated }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('JAPANESE');
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLanguages();
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('/api/enums/languages');
      setLanguages(response.data);
    } catch (error) {
      console.error('Error fetching languages:', error);
      setError('Не удалось загрузить список языков');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Введите название текста');
      return;
    }

    try {
      const response = await axios.post('/api/texts', {
        title: title.trim(),
        content: '',
        language
      });
      onTextCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating text:', error);
      setError('Не удалось создать текст');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-form">
        <h2>Создать новый текст</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название текста"
              className="form-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-input"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.value}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              Создать
            </button>
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateText;
