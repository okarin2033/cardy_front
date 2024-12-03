import React from 'react';
import '../../styles/text/text-panel.css';

const TextPanel = ({ selectedText }) => {
  return (
    <div className="text-panel">
      <div className="text-panel-content">
        <div className="selected-content">
          <p>{selectedText || 'Выберите текст для перевода'}</p>
        </div>
        <div className="action-buttons">
          <button className="panel-button primary">Перевести</button>
          <button className="panel-button">В избранное</button>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
