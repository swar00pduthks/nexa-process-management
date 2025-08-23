import React from 'react';
import { Handle } from 'reactflow';

const JourneyActionNode = ({ data }) => {
  const { action } = data;
  
  const getStatusColor = () => {
    if (action.status === 'completed') return '#22c55e';
    return '#f59e0b';
  };

  const getStatusIcon = () => {
    if (action.status === 'completed') return '✅';
    return '⏳';
  };

  return (
    <div className="journey-action-node">
      <Handle type="target" position="left" />
      
      <div className="node-content">
        <div className="action-marker" style={{ backgroundColor: getStatusColor() }}>
          <span className="status-icon">{getStatusIcon()}</span>
        </div>
        <div className="action-info">
          <div className="action-name">{action.name}</div>
          <div className="action-status">{action.status}</div>
        </div>
      </div>
    </div>
  );
};

export default JourneyActionNode;
