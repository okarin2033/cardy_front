import React, { useEffect } from 'react';
import '../../styles/common/slide-panel.css';

const SlidePanel = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      if (isOpen) {
        appContent.classList.add('panel-open');
      } else {
        appContent.classList.remove('panel-open');
      }
    }
  }, [isOpen]);

  return (
    <div className={`slide-panel ${isOpen ? 'open' : ''}`}>
      <div className="slide-panel-header">
        <h2>Детали</h2>
        <button className="slide-panel-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="slide-panel-content">
        {children}
      </div>
    </div>
  );
};

export default SlidePanel;
