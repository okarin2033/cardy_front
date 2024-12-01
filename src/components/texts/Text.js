import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import axios from '../../axiosConfig';
import '../../styles/text.css';
import 'react-quill/dist/quill.snow.css';

const Text = ({ text, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(text?.title || '');
  const [editedContent, setEditedContent] = useState(text?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      setError('Please enter a title');
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
      setError('Failed to save text. Please try again.');
    } finally {
      setSaving(false);
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
    if (typeof lang === 'string') return lang;
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
            placeholder="Enter title"
          />
        ) : (
          <h3>{text.title}</h3>
        )}
        <div className="text-actions">
          {isEditing ? (
            <>
              <button
                className="cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              className="edit-button"
              onClick={handleEdit}
            >
              Edit
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
          <div className="ql-editor">
            {text.content ? (
              <div dangerouslySetInnerHTML={{ __html: text.content }} />
            ) : (
              <p className="no-content">No content</p>
            )}
          </div>
        )}
      </div>

      <div className="text-footer">
        <span className="text-language">{getLanguageDisplay(text.language)}</span>
      </div>
    </div>
  );
};

export default Text;
