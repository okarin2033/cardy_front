import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import axios from '../../axiosConfig';
import AIResponse from '../common/AIResponse';
import '../../styles/text.css';
import 'react-quill/dist/quill.snow.css';

const Text = ({ text, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(text?.title || '');
  const [editedContent, setEditedContent] = useState(text?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [fullTranslation, setFullTranslation] = useState('');
  const [translatingFull, setTranslatingFull] = useState(false);

  useEffect(() => {
    setEditedTitle(text?.title || '');
    setEditedContent(text?.content || '');
  }, [text]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedTitle(text.title);
    setEditedContent(text.content);
    setIsEditing(false);
    setError('');
  };

  const getLanguageCode = (language) => {
    if (!language) return '';
    if (typeof language === 'string') return language;
    return language.code || '';
  };

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      setError('Пожалуйста, введите название');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await axios.put(`/texts/${text.id}`, {
        title: editedTitle.trim(),
        content: editedContent,
        language: getLanguageCode(text.language)
      });

      if (response.data) {
        onUpdate(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving text:', err);
      setError('Не удалось сохранить текст. Пожалуйста, попробуйте снова.');
    } finally {
      setSaving(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      setSelectedText(selectedText);
      setShowTranslation(true);
      setTranslation('');
    }
  };

  const handleTranslateSelection = async () => {
    if (!selectedText) return;
    
    try {
      setTranslating(true);
      setError('');
      const response = await axios.get(`/api/ai/text/${text.id}/explain`, {
        params: {
          sentence: selectedText,
          targetLanguage: 'RUSSIAN'
        }
      });
      setTranslation(response.data);
    } catch (err) {
      console.error('Error translating selection:', err);
      setError('Не удалось перевести выделенный текст');
    } finally {
      setTranslating(false);
    }
  };

  const handleTranslateText = async () => {
    try {
      setTranslatingFull(true);
      setError('');
      const response = await axios.post(`/api/ai/text/${text.id}/translate`, null, {
        params: {
          targetLanguage: 'RUSSIAN'
        }
      });
      setFullTranslation(response.data);
    } catch (err) {
      console.error('Error translating text:', err);
      setError('Не удалось перевести текст');
    } finally {
      setTranslatingFull(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet'
  ];

  const getLanguageDisplay = (lang) => {
    if (!lang) return '';
    if (typeof lang === 'string') {
      switch(lang.toLowerCase()) {
        case 'english': return 'Английский';
        case 'russian': return 'Русский';
        case 'japanese': return 'Японский';
        default: return lang;
      }
    }
    return lang.name || lang.code || '';
  };

  return (
    <div className="text-card">
      <div className="text-header">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="title-input"
            placeholder="Введите название"
          />
        ) : (
          <div className="text-header-content">
            <h3>{text.title}</h3>
            <button
              className="translate-text-button"
              onClick={handleTranslateText}
              disabled={translatingFull}
            >
              <i className="fas fa-language"></i>
              {translatingFull ? 'Перевод...' : 'Перевести текст'}
            </button>
          </div>
        )}
        <div className="text-actions">
          {isEditing ? (
            <>
              <button
                className="cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Отмена
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          ) : (
            <button
              className="edit-button"
              onClick={handleEdit}
            >
              Редактировать
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="text-content">
        {isEditing ? (
          <ReactQuill
            theme="snow"
            value={editedContent}
            onChange={setEditedContent}
            modules={modules}
            formats={formats}
          />
        ) : (
          <div 
            className="ql-editor"
            onMouseUp={handleTextSelection}
          >
            {text.content ? (
              <div dangerouslySetInnerHTML={{ __html: text.content }} />
            ) : (
              <p className="no-content">Текст пока пуст</p>
            )}
          </div>
        )}
      </div>

      {showTranslation && selectedText && (
        <div className="translation-panel">
          <div className="translation-header">
            <h4>Выделенный текст:</h4>
            <div className="translation-actions">
              <button
                className="translate-button"
                onClick={handleTranslateSelection}
                disabled={translating}
              >
                <i className="fas fa-language"></i>
                {translating ? 'Перевод...' : 'Перевести'}
              </button>
              <button
                className="close-translation-button"
                onClick={() => {
                  setShowTranslation(false);
                  setTranslation('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <p className="selected-text">{selectedText}</p>
          <AIResponse 
            content={translation}
            isLoading={translating}
            error={error}
          />
        </div>
      )}

      {fullTranslation && (
        <div className="translation-panel full-translation">
          <div className="translation-header">
            <h4>Перевод текста:</h4>
            <button
              className="close-translation-button"
              onClick={() => setFullTranslation('')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <AIResponse 
            content={fullTranslation}
            isLoading={translatingFull}
            error={error}
          />
        </div>
      )}

      <div className="text-footer">
        <span className="text-language">
          <i className="fas fa-language"></i>
          {getLanguageDisplay(text.language)}
        </span>
      </div>
    </div>
  );
};

export default Text;
