import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMEventNode = memo(({ data, selected }) => {
  const getEventIcon = (eventType) => {
    const icons = {
      'message': '💬',
      'timer': '⏰',
      'signal': '📡',
      'error': '❌',
      'escalation': '📈',
      'compensation': '💰',
      'conditional': '🔍',
      'link': '🔗',
      'terminate': '🛑',
      'default': '⚡'
    };
    return icons[eventType] || icons.default;
  };

  const getEventColor = (eventType) => {
    const colors = {
      'message': '#3b82f6',
      'timer': '#f59e0b',
      'signal': '#8b5cf6',
      'error': '#ef4444',
      'escalation': '#f97316',
      'compensation': '#10b981',
      'conditional': '#6b7280',
      'link': '#6366f1',
      'terminate': '#dc2626',
      'default': '#6b7280'
    };
    return colors[eventType] || colors.default;
  };

  return (
    <div className={`bpm-node bpm-event-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span 
            className="bpm-icon"
            style={{ color: getEventColor(data.eventType) }}
          >
            {getEventIcon(data.eventType)}
          </span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'Event'}
        </div>
        <div className="bpm-event-type">
          {data.eventType || 'intermediate'}
        </div>
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
      {/* Event Properties */}
      {data.properties && Object.keys(data.properties).length > 0 && (
        <div className="bpm-node-properties">
          {data.properties.eventDefinition && (
            <div className="bpm-property">
              <span className="bpm-property-label">Definition:</span>
              <span className="bpm-property-value">{data.properties.eventDefinition}</span>
            </div>
          )}
          {data.properties.expression && (
            <div className="bpm-property">
              <span className="bpm-property-label">Expression:</span>
              <span className="bpm-property-value">{data.properties.expression}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="bpm-handle bpm-handle-input"
        style={{ background: getEventColor(data.eventType) }}
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="bpm-handle bpm-handle-output"
        style={{ background: getEventColor(data.eventType) }}
      />
      
      {/* Node Status */}
      {data.status && (
        <div className={`bpm-node-status bpm-status-${data.status}`}>
          <span className="bpm-status-dot"></span>
          {data.status}
        </div>
      )}
      
      {/* Event Trigger */}
      {data.triggered && (
        <div className="bpm-event-trigger">
          <span className="bpm-icon">🎯</span>
          Triggered at {data.triggered}
        </div>
      )}
    </div>
  );
});

export default BPMEventNode;
