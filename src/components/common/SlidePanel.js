import React from 'react';
import '../../styles/common/slide-panel.css';

const SlidePanel = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`slide-panel ${isOpen ? 'open' : ''}`}>
      <div className="slide-panel-header">
        <button className="slide-panel-close" onClick={onClose}>×</button>
      </div>
      <div className="slide-panel-content">
        {children}
      </div>
    </div>
  );
};

export default SlidePanel;
