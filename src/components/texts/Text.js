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
  const [translationPosition, setTranslationPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [translationPanel, setTranslationPanel] = useState({
    visible: false,
    mode: null, // 'selection' или 'full'
    content: '',
    isLoading: false
  });

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
      setTranslationPanel(prev => ({
        ...prev,
        visible: true,
        mode: 'selection',
        content: ''
      }));
    }
  };

  const handleTranslateSelection = async () => {
    if (!selectedText) return;
    
    try {
      setTranslationPanel(prev => ({ ...prev, isLoading: true }));
      setError('');
      const response = await axios.get(`/api/ai/text/${text.id}/explain`, {
        params: {
          sentence: selectedText,
          targetLanguage: 'RUSSIAN'
        }
      });
      
      const formattedText = response.data
        .split('\n')
        .map(line => {
          if (line.startsWith('##') && !line.startsWith('###')) {
            return `<h2>${line.replace('##', '').trim()}</h2>`;
          }
          if (line.startsWith('###')) {
            return `<h3>${line.replace('###', '').trim()}</h3>`;
          }
          return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        })
        .join('<br>');

      setTranslationPanel(prev => ({
        ...prev,
        content: formattedText,
        isLoading: false
      }));
    } catch (err) {
      console.error('Error translating selection:', err);
      setError('Не удалось перевести выделенный текст');
      setTranslationPanel(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleTranslateText = async () => {
    try {
      setTranslationPanel(prev => ({
        ...prev,
        visible: true,
        mode: 'full',
        isLoading: true,
        content: ''
      }));
      setError('');
      const response = await axios.post(`/api/ai/text/${text.id}/translate`, null, {
        params: {
          targetLanguage: 'RUSSIAN'
        }
      });
      
      const formattedText = response.data
        .split('\n')
        .map(line => {
          if (line.startsWith('##') && !line.startsWith('###')) {
            return `<h2>${line.replace('##', '').trim()}</h2>`;
          }
          if (line.startsWith('###')) {
            return `<h3>${line.replace('###', '').trim()}</h3>`;
          }
          return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        })
        .join('<br>');

      setTranslationPanel(prev => ({
        ...prev,
        content: formattedText,
        isLoading: false
      }));
    } catch (err) {
      console.error('Error translating text:', err);
      setError('Не удалось перевести текст');
      setTranslationPanel(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDragStart = (e) => {
    const panel = e.currentTarget;
    const rect = panel.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (isDragging && e.clientX && e.clientY) {
      setTranslationPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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
              disabled={translationPanel.isLoading}
            >
              <i className="fas fa-language"></i>
              {translationPanel.isLoading ? 'Перевод...' : 'Перевести текст'}
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

      {translationPanel.visible && (
        <div 
          className="translation-panel"
          style={{
            left: `${translationPosition.x}px`,
            top: `${translationPosition.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="translation-header">
            <h4>{translationPanel.mode === 'selection' ? 'Выделенный текст' : 'Перевод текста'}</h4>
            <div className="translation-actions">
              {translationPanel.mode === 'selection' && (
                <button
                  className="translate-button"
                  onClick={handleTranslateSelection}
                  disabled={translationPanel.isLoading}
                >
                  <i className="fas fa-language"></i>
                  {translationPanel.isLoading ? 'Перевод...' : 'Перевести'}
                </button>
              )}
              <button
                className="close-translation-button"
                onClick={() => {
                  setTranslationPanel(prev => ({ ...prev, visible: false }));
                  setSelectedText('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {translationPanel.mode === 'selection' && (
            <p className="selected-text">{selectedText}</p>
          )}

          {translationPanel.isLoading ? (
            <div className="translation-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Получаем перевод...</span>
            </div>
          ) : (
            <AIResponse 
              content={translationPanel.content}
              error={error}
            />
          )}
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
