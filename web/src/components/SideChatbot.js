import React, { useState, useRef, useEffect } from 'react';
import './SideChatbot.css';

const SideChatbot = ({ messages, onSendMessage, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessage = (content) => {
    // Convert line breaks to <br> tags and handle markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.trim().startsWith('•')) {
          return `<li>${line.substring(1).trim()}</li>`;
        }
        return line;
      })
      .join('<br>');
  };

  const quickActions = [
    "How do I add entities?",
    "How do I create conditions?",
    "How do I set up actions?",
    "How do I save my flow?",
    "Show me an example"
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    onSendMessage(action);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="side-chatbot">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="chatbot-avatar">🤖</div>
          <div className="chatbot-info">
            <h3>AI Assistant</h3>
            <span className="chatbot-status">Online</span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ×
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.type === 'bot' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessage(message.content) 
                }}
              />
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            {message.type === 'user' && (
              <div className="message-avatar">👤</div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        <h4>💡 Quick Help</h4>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="quick-action-btn"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about building business process flows..."
            className="message-input"
            rows="1"
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!inputMessage.trim()}
          >
            ➤
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};

export default SideChatbot;


