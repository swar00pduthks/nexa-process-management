import React from 'react';
import './RuleConfiguration.css';

const RuleConfiguration = ({ rule }) => {
  if (!rule) {
    return (
      <div className="rule-configuration">
        <h3>⚙️ Rule Configuration</h3>
        <div className="no-rule">
          <p>No rule selected. Create a rule using natural language or the flow builder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rule-configuration">
      <h3>⚙️ Rule Configuration</h3>
      
      <div className="rule-summary">
        <div className="rule-section">
          <h4>📋 Rule Summary</h4>
          <div className="rule-logic">
            <span className="logic-badge">{rule.logic}</span>
            <span className="logic-text">logic between conditions</span>
          </div>
        </div>

        <div className="rule-section">
          <h4>📊 Conditions ({rule.conditions?.length || 0})</h4>
          {rule.conditions && rule.conditions.length > 0 ? (
            <div className="conditions-list">
              {rule.conditions.map((condition, index) => (
                <div key={index} className="condition-item">
                  <div className="condition-header">
                    <span className="condition-number">#{index + 1}</span>
                    <span className="condition-field">{condition.field}</span>
                  </div>
                  <div className="condition-details">
                    <span className="condition-operator">{condition.operator}</span>
                    <span className="condition-value">"{condition.value}"</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-conditions">No conditions defined</p>
          )}
        </div>

        <div className="rule-section">
          <h4>🚀 Actions ({rule.actions?.length || 0})</h4>
          {rule.actions && rule.actions.length > 0 ? (
            <div className="actions-list">
              {rule.actions.map((action, index) => (
                <div key={index} className="action-item">
                  <div className="action-header">
                    <span className="action-type">{action.type}</span>
                    {action.jobName && (
                      <span className="action-job">{action.jobName}</span>
                    )}
                  </div>
                  <p className="action-description">{action.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-actions">No actions defined</p>
          )}
        </div>
      </div>

      <div className="rule-actions">
        <button className="btn-primary">💾 Save Rule</button>
        <button className="btn-secondary">🔄 Test Rule</button>
        <button className="btn-outline">📋 Export</button>
      </div>
    </div>
  );
};

export default RuleConfiguration;
