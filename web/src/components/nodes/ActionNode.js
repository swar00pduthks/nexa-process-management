import React from 'react';
import { Handle } from 'reactflow';

const ActionNode = ({ data }) => {
  const { action, isDestination, stationName } = data;

  const getActionIcon = () => {
    if (isDestination) {
      return '🎯'; // Destination icon
    } else if (action?.eventType === 'business-process-completed') {
      return '✅'; // Completion icon
    } else {
      return '⚡'; // Action icon
    }
  };

  const getActionText = () => {
    if (isDestination) {
      return 'Final Destination';
    } else if (action?.eventType) {
      return action.eventType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else {
      return 'Process Action';
    }
  };

  return (
    <div className="action-node">
      <Handle type="target" position="left" className="react-flow__handle" />
      
      <div className="node-header">
        <div className="node-icon">
          <span className="action-icon">{getActionIcon()}</span>
        </div>
        <div className="node-content">
          <div className="node-title">{stationName || 'Action Node'}</div>
          <div className="node-type">{getActionText()}</div>
        </div>
      </div>
      
      {action && (
        <div className="action-details">
          <div className="action-type">
            {action.eventType || 'notification'}
          </div>
          {action.eventName && (
            <div className="action-name">
              {action.eventName}
            </div>
          )}
          {action.eventData && Object.keys(action.eventData).length > 0 && (
            <div className="event-data">
              <div className="mapping-label">Event Data:</div>
              <div className="mapping-items">
                {Object.entries(action.eventData).map(([key, value]) => (
                  <div key={key} className="mapping-item">
                    <span className="mapping-key">{key}:</span>
                    <span className="mapping-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {action.contextMapping && Object.keys(action.contextMapping).length > 0 && (
            <div className="context-mapping">
              <div className="mapping-label">Context Mapping:</div>
              <div className="mapping-items">
                {Object.entries(action.contextMapping).map(([key, value]) => (
                  <div key={key} className="mapping-item">
                    <span className="mapping-key">{key}:</span>
                    <span className="mapping-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <Handle type="source" position="right" className="react-flow__handle" />
    </div>
  );
};

export default ActionNode;
