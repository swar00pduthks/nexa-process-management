import React, { useState } from 'react';
import './NaturalLanguageInput.css';

const NaturalLanguageInput = ({ onRuleGenerated }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const templates = [
    "When both customer data and sales data are ready for the same date, trigger P&L calculator",
    "If inventory is low AND orders are pending, create purchase request",
    "When customer has payment issue AND support ticket, escalate to senior team",
    "When revenue exceeds target AND customer satisfaction is high, send success notification",
    "If system error rate exceeds 5% for 10 minutes, trigger incident response"
  ];

  const parseNaturalLanguage = (text) => {
    setIsProcessing(true);
    
    // Simple NLP parsing logic
    const parsed = {
      conditions: [],
      actions: [],
      logic: 'AND'
    };

    // Extract conditions
    const conditionPatterns = [
      /when\s+(.+?)\s+(?:and|or)\s+(.+?)\s+(?:then|,)/gi,
      /if\s+(.+?)\s+(?:and|or)\s+(.+?)\s+(?:then|,)/gi,
      /when\s+(.+?)\s+then/gi,
      /if\s+(.+?)\s+then/gi
    ];

    conditionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const conditions = match.split(/\s+(?:and|or)\s+/i);
          conditions.forEach(condition => {
            if (condition.trim() && !condition.includes('then')) {
              parsed.conditions.push({
                description: condition.trim(),
                field: extractField(condition),
                operator: extractOperator(condition),
                value: extractValue(condition)
              });
            }
          });
        });
      }
    });

    // Extract actions
    const actionPatterns = [
      /trigger\s+([^,\s]+)/gi,
      /create\s+([^,\s]+)/gi,
      /send\s+([^,\s]+)/gi,
      /escalate\s+([^,\s]+)/gi
    ];

    actionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const action = match.split(/\s+/)[1];
          parsed.actions.push({
            description: match.trim(),
            type: extractActionType(match),
            jobName: action
          });
        });
      }
    });

    // Determine logic
    if (text.toLowerCase().includes('and')) {
      parsed.logic = 'AND';
    } else if (text.toLowerCase().includes('or')) {
      parsed.logic = 'OR';
    }

    setIsProcessing(false);
    return parsed;
  };

  const extractField = (condition) => {
    const fieldPatterns = [
      /customer\s+data/gi,
      /sales\s+data/gi,
      /inventory/gi,
      /orders/gi,
      /revenue/gi,
      /error\s+rate/gi
    ];

    for (const pattern of fieldPatterns) {
      const match = condition.match(pattern);
      if (match) return match[0].toLowerCase().replace(/\s+/g, '_');
    }
    return 'unknown_field';
  };

  const extractOperator = (condition) => {
    if (condition.includes('equals') || condition.includes('=')) return 'equals';
    if (condition.includes('exceeds') || condition.includes('>')) return 'greater_than';
    if (condition.includes('low') || condition.includes('<')) return 'less_than';
    if (condition.includes('ready')) return 'is_ready';
    return 'equals';
  };

  const extractValue = (condition) => {
    const valuePatterns = [
      /(\d+%)/g,
      /(\d+\s+minutes)/g,
      /(\d+\s+hours)/g,
      /(same\s+date)/g,
      /(low)/g,
      /(high)/g
    ];

    for (const pattern of valuePatterns) {
      const match = condition.match(pattern);
      if (match) return match[0];
    }
    return '';
  };

  const extractActionType = (action) => {
    if (action.includes('trigger')) return 'trigger_job';
    if (action.includes('create')) return 'create_request';
    if (action.includes('send')) return 'send_notification';
    if (action.includes('escalate')) return 'escalate';
    return 'trigger_job';
  };

  const handleGenerateFlow = () => {
    if (!input.trim()) return;
    
    const parsedRule = parseNaturalLanguage(input);
    onRuleGenerated(parsedRule);
  };

  const handleTemplateClick = (template) => {
    setInput(template);
  };

  return (
    <div className="natural-language-input">
      <div className="input-section">
        <h3>📝 Describe Your Business Rule</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., When both customer data and sales data are ready for the same date, trigger P&L calculator"
          className="rule-input"
          rows={4}
        />
        
        <div className="suggestions">
          <h4>💡 Quick Templates:</h4>
          <div className="templates-grid">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateClick(template)}
                className="template-btn"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerateFlow}
          className="generate-btn"
          disabled={isProcessing || !input.trim()}
        >
          {isProcessing ? '🔄 Processing...' : '🚀 Generate Flow'}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-panel">
          <h4>💭 Smart Suggestions:</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageInput;
