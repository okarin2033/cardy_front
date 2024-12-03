import React from 'react';
import '../../styles/text/text-panel.css';

const TextPanel = ({ selectedText }) => {
  return (
    <div className="text-panel">
      <h3>Text Panel</h3>
      <div className="text-panel-content">
        <div className="selected-content">
          <h4>Selected Text:</h4>
          <p>{selectedText || 'No text selected'}</p>
        </div>
        <div className="test-buttons">
          <button className="panel-button">Test Button 1</button>
          <button className="panel-button">Test Button 2</button>
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
