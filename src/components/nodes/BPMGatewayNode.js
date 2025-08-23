import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMGatewayNode = memo(({ data, selected }) => {
  const getGatewayIcon = (gatewayType) => {
    const icons = {
      'exclusive': '🔀',
      'inclusive': '🔀',
      'parallel': '⫴',
      'event-based': '⚡',
      'complex': '🔗',
      'default': '🔀'
    };
    return icons[gatewayType] || icons.default;
  };

  const getGatewayColor = (gatewayType) => {
    const colors = {
      'exclusive': '#ef4444',
      'inclusive': '#f59e0b',
      'parallel': '#3b82f6',
      'event-based': '#8b5cf6',
      'complex': '#6b7280',
      'default': '#6b7280'
    };
    return colors[gatewayType] || colors.default;
  };

  return (
    <div className={`bpm-node bpm-gateway-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span 
            className="bpm-icon"
            style={{ color: getGatewayColor(data.gatewayType) }}
          >
            {getGatewayIcon(data.gatewayType)}
          </span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'Gateway'}
        </div>
        <div className="bpm-gateway-type">
          {data.gatewayType || 'exclusive'}
        </div>
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
      {/* Gateway Conditions */}
      {data.conditions && data.conditions.length > 0 && (
        <div className="bpm-gateway-conditions">
          <div className="bpm-conditions-header">
            <span className="bpm-icon">🔍</span>
            Conditions
          </div>
          {data.conditions.map((condition, index) => (
            <div key={index} className="bpm-condition">
              <span className="bpm-condition-label">{condition.label}:</span>
              <span className="bpm-condition-value">{condition.expression}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="bpm-handle bpm-handle-input"
        style={{ background: getGatewayColor(data.gatewayType) }}
      />
      
      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="output-1"
        className="bpm-handle bpm-handle-output"
        style={{ background: getGatewayColor(data.gatewayType) }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-2"
        className="bpm-handle bpm-handle-output"
        style={{ background: getGatewayColor(data.gatewayType) }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-3"
        className="bpm-handle bpm-handle-output"
        style={{ background: getGatewayColor(data.gatewayType) }}
      />
      
      {/* Node Status */}
      {data.status && (
        <div className={`bpm-node-status bpm-status-${data.status}`}>
          <span className="bpm-status-dot"></span>
          {data.status}
        </div>
      )}
      
      {/* Decision Path */}
      {data.decisionPath && (
        <div className="bpm-decision-path">
          <span className="bpm-icon">🎯</span>
          {data.decisionPath}
        </div>
      )}
    </div>
  );
});

export default BPMGatewayNode;
