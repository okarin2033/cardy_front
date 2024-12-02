import React from 'react';
import '../../styles/ai-response.css';

const AIResponse = ({ content, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="ai-response loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Получаем ответ от ИИ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-response error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!content) return null;

  const formatContent = (text) => {
    return text
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
  };

  return (
    <div className="ai-response">
      <div 
        className="ai-content"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
};

export default AIResponse;
