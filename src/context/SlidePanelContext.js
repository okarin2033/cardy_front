import React, { createContext, useContext, useState, useCallback } from 'react';
import SlidePanel from '../components/common/SlidePanel';

const SlidePanelContext = createContext(null);

export const SlidePanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openPanel = useCallback((content) => {
    setContent(content);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300); // Очищаем контент после анимации
  }, []);

  return (
    <SlidePanelContext.Provider value={{ openPanel, closePanel }}>
      {children}
      <SlidePanel isOpen={isOpen} onClose={closePanel}>
        {content}
      </SlidePanel>
    </SlidePanelContext.Provider>
  );
};

export const useSlidePanel = () => {
  const context = useContext(SlidePanelContext);
  if (!context) {
    throw new Error('useSlidePanel must be used within a SlidePanelProvider');
  }
  return context;
};
