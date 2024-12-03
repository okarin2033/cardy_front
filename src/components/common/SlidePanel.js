import React, { useState, useRef, useEffect } from 'react';
import '../../styles/common/slide-panel.css';

const SlidePanel = ({ isOpen, onClose, children }) => {
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing && panelRef.current) {
      const newWidth = document.body.clientWidth - e.clientX;
      const minWidth = 280; // минимальная ширина
      const maxWidth = window.innerWidth * 0.25; // 25% от ширины окна
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(clampedWidth);
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <div className={`slide-panel-wrapper ${isOpen ? 'open' : ''}`}>
      <div 
        ref={panelRef}
        className={`slide-panel ${isOpen ? 'open' : ''}`} 
        style={{ width: `${width}px` }}
      >
        <div className="slide-panel-resize" onMouseDown={startResizing}></div>
        <div className="slide-panel-header">
          <h2>Детали</h2>
          <button className="slide-panel-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4l7 8-7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="slide-panel-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlidePanel;
