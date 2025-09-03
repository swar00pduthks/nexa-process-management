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
    
    // Enhanced NLP parsing logic that generates structured rules
    const parsed = {
      entities: [],
      conditions: [],
      actions: [],
      joinConditions: [],
      logic: 'AND',
      description: text
    };

    // Extract entities from the text
    const entityPatterns = [
      { pattern: /customer\s+data/gi, type: 'customer', name: 'Customer Data', icon: '👥' },
      { pattern: /sales\s+data/gi, type: 'sales', name: 'Sales Data', icon: '💰' },
      { pattern: /inventory/gi, type: 'inventory', name: 'Inventory', icon: '📦' },
      { pattern: /orders/gi, type: 'order', name: 'Orders', icon: '📋' },
      { pattern: /payment/gi, type: 'payment', name: 'Payment', icon: '💳' },
      { pattern: /support\s+ticket/gi, type: 'support', name: 'Support Ticket', icon: '🎫' },
      { pattern: /system/gi, type: 'system', name: 'System', icon: '⚙️' }
    ];

    entityPatterns.forEach(({ pattern, type, name, icon }) => {
      if (text.match(pattern)) {
        parsed.entities.push({
          type,
          name,
          icon,
          attributes: getDefaultAttributes(type),
          selectedAttributes: getDefaultAttributes(type)
        });
      }
    });

    // Extract conditions with better parsing
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
              const parsedCondition = parseCondition(condition.trim());
              if (parsedCondition) {
                parsed.conditions.push(parsedCondition);
              }
            }
          });
        });
      }
    });

    // Extract actions with better parsing
    const actionPatterns = [
      /trigger\s+([^,\s]+)/gi,
      /create\s+([^,\s]+)/gi,
      /send\s+([^,\s]+)/gi,
      /escalate\s+([^,\s]+)/gi,
      /notify\s+([^,\s]+)/gi
    ];

    actionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const parsedAction = parseAction(match.trim());
          if (parsedAction) {
            parsed.actions.push(parsedAction);
          }
        });
      }
    });

    // Create join conditions if multiple entities
    if (parsed.entities.length > 1) {
      parsed.joinConditions.push({
        leftEntity: parsed.entities[0].type,
        leftAttribute: 'business_date',
        operator: '=',
        rightEntity: parsed.entities[1].type,
        rightAttribute: 'business_date'
      });
    }

    // If no entities found, create default ones based on conditions
    if (parsed.entities.length === 0) {
      parsed.entities.push({
        type: 'input',
        name: 'Input Data',
        icon: '📥',
        attributes: ['data'],
        selectedAttributes: ['data']
      });
    }

    // If no conditions found, create a default one
    if (parsed.conditions.length === 0) {
      parsed.conditions.push({
        name: 'Default Condition',
        expression: 'data',
        operator: 'not_empty',
        value: ''
      });
    }

    // If no actions found, create a default one
    if (parsed.actions.length === 0) {
      parsed.actions.push({
        name: 'Default Action',
        type: 'notification',
        description: 'Process completed'
      });
    }

    setIsProcessing(false);
    return parsed;
  };

  const parseCondition = (conditionText) => {
    const condition = {
      name: conditionText,
      expression: '',
      operator: 'equals',
      value: ''
    };

    // Parse specific condition patterns
    if (conditionText.includes('ready')) {
      condition.expression = 'status';
      condition.operator = 'equals';
      condition.value = 'ready';
    } else if (conditionText.includes('low')) {
      condition.expression = 'quantity';
      condition.operator = 'less_than';
      condition.value = 'threshold';
    } else if (conditionText.includes('exceeds') || conditionText.includes('>')) {
      condition.expression = extractFieldFromCondition(conditionText);
      condition.operator = 'greater_than';
      condition.value = extractValueFromCondition(conditionText);
    } else if (conditionText.includes('same date')) {
      condition.expression = 'business_date';
      condition.operator = 'equals';
      condition.value = '${business_date}';
    } else if (conditionText.includes('payment issue')) {
      condition.expression = 'payment_status';
      condition.operator = 'equals';
      condition.value = 'failed';
    } else if (conditionText.includes('error rate')) {
      condition.expression = 'error_rate';
      condition.operator = 'greater_than';
      condition.value = '5%';
    } else {
      // Default parsing
      condition.expression = extractFieldFromCondition(conditionText);
      condition.operator = 'not_empty';
      condition.value = '';
    }

    return condition;
  };

  const parseAction = (actionText) => {
    const action = {
      name: '',
      type: 'notification',
      description: actionText
    };

    if (actionText.includes('trigger')) {
      const jobName = actionText.replace(/trigger\s+/i, '');
      action.name = `Trigger ${jobName}`;
      action.type = 'trigger_job';
      action.jobName = jobName;
    } else if (actionText.includes('create')) {
      const requestType = actionText.replace(/create\s+/i, '');
      action.name = `Create ${requestType}`;
      action.type = 'create_request';
      action.requestType = requestType;
    } else if (actionText.includes('send')) {
      const notificationType = actionText.replace(/send\s+/i, '');
      action.name = `Send ${notificationType}`;
      action.type = 'send_notification';
      action.notificationType = notificationType;
    } else if (actionText.includes('escalate')) {
      const target = actionText.replace(/escalate\s+to\s+/i, '');
      action.name = `Escalate to ${target}`;
      action.type = 'escalate';
      action.target = target;
    } else {
      action.name = actionText;
    }

    return action;
  };

  const extractFieldFromCondition = (condition) => {
    const fieldPatterns = [
      /customer\s+data/gi,
      /sales\s+data/gi,
      /inventory/gi,
      /orders/gi,
      /revenue/gi,
      /error\s+rate/gi,
      /payment/gi
    ];

    for (const pattern of fieldPatterns) {
      const match = condition.match(pattern);
      if (match) return match[0].toLowerCase().replace(/\s+/g, '_');
    }
    return 'data';
  };

  const extractValueFromCondition = (condition) => {
    const valuePatterns = [
      /(\d+%)/g,
      /(\d+\s+minutes)/g,
      /(\d+\s+hours)/g,
      /(\d+)/g,
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

  const getDefaultAttributes = (entityType) => {
    const attributeMap = {
      customer: ['customer_id', 'name', 'email', 'status', 'business_date'],
      sales: ['order_id', 'customer_id', 'amount', 'status', 'business_date'],
      inventory: ['product_id', 'quantity', 'threshold', 'status'],
      order: ['order_id', 'customer_id', 'amount', 'status'],
      payment: ['payment_id', 'customer_id', 'amount', 'status'],
      support: ['ticket_id', 'customer_id', 'priority', 'status'],
      system: ['metric_name', 'value', 'timestamp', 'threshold'],
      input: ['data', 'timestamp', 'source']
    };
    return attributeMap[entityType] || ['id', 'data'];
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
