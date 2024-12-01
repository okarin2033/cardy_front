import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../axiosConfig';
import '../../styles/textEditor.css';

const TextEditor = ({ text, onClose, onSave }) => {
  const [title, setTitle] = useState(text?.title || '');
  const [content, setContent] = useState(text?.content || '');
  const [language, setLanguage] = useState(text?.language?.code || '');
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('/enums/languages');
      setLanguages(response.data);
    } catch (err) {
      console.error('Error fetching languages:', err);
      setError('Failed to load languages');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !language) {
      setError('Please fill in all fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const textData = {
        title,
        content,
        language
      };

      let response;
      if (text?.id) {
        response = await axios.put(`/texts/${text.id}`, textData);
      } else {
        response = await axios.post('/texts', textData);
      }

      if (response.data) {
        onSave(response.data);
        onClose();
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

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        <div className="editor-header">
          <h2>{text?.id ? 'Edit Text' : 'Create New Text'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">Select language</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Content:</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          </div>

          <div className="editor-actions">
            <button 
              className="cancel-button" 
              onClick={onClose}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
