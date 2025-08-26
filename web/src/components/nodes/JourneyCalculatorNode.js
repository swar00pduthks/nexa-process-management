import React from 'react';
import { Handle } from 'reactflow';

const JourneyCalculatorNode = ({ data }) => {
  const { calculator } = data;
  
  const getStatusColor = () => {
    if (calculator.status === 'completed') return '#22c55e';
    if (calculator.status === 'in-progress') return '#3b82f6';
    return '#f59e0b';
  };

  const getStatusIcon = () => {
    if (calculator.status === 'completed') return '✅';
    if (calculator.status === 'in-progress') return '🔄';
    return '⏳';
  };

  return (
    <div className="journey-calculator-node">
      <Handle type="target" position="left" />
      
      <div className="node-content">
        <div className="calculator-marker" style={{ backgroundColor: getStatusColor() }}>
          <span className="status-icon">{getStatusIcon()}</span>
        </div>
        <div className="calculator-info">
          <div className="calculator-name">{calculator.name}</div>
          <div className="calculator-status">{calculator.status}</div>
        </div>
      </div>

      <Handle type="source" position="right" />
    </div>
  );
};

export default JourneyCalculatorNode;
