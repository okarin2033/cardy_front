import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import axios from '../../axiosConfig';
import AIResponse from '../common/AIResponse';
import TranslationMenu from '../translation/TranslationMenu';
import TextPanel from './TextPanel';
import { useSlidePanel } from '../../context/SlidePanelContext';
import '../../styles/text/text.css';
import 'react-quill/dist/quill.snow.css';

const Text = ({ text, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(text?.title || '');
  const [editedContent, setEditedContent] = useState(text?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { openPanel, closePanel } = useSlidePanel();

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

  const handleTextSelection = useCallback((event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);
      setSelectedWord(selectedText);
      setMenuPosition({
        x: event.clientX,
        y: event.clientY - 10 // Немного выше курсора
      });
    } else {
      setSelectedText('');
      setSelectedWord('');
      closePanel();
    }
  }, [closePanel]);

  const handleShowDetails = useCallback((text) => {
    openPanel(<TextPanel selectedText={text} />);
  }, [openPanel]);

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
          </div>
        )}
        <div className="text-actions">
          {isEditing ? (
            <React.Fragment>
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
            </React.Fragment>
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

      {selectedWord && (
        <TranslationMenu
          word={selectedWord}
          position={menuPosition}
          onClose={() => setSelectedWord('')}
          textLanguage={text?.language}
          onShowDetails={() => handleShowDetails(selectedText)}
        />
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
