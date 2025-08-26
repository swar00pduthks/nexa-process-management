import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMTaskNode = memo(({ data, selected }) => {
  const getTaskIcon = (taskType) => {
    const icons = {
      'user-task': '👤',
      'service-task': '⚙️',
      'script-task': '📝',
      'manual-task': '✋',
      'business-rule-task': '📋',
      'send-task': '📤',
      'receive-task': '📥',
      'default': '📋'
    };
    return icons[taskType] || icons.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#6b7280',
      'running': '#3b82f6',
      'completed': '#10b981',
      'failed': '#ef4444',
      'cancelled': '#f59e0b'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={`bpm-node bpm-task-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span className="bpm-icon">{getTaskIcon(data.taskType)}</span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'Task'}
        </div>
        {data.priority && (
          <div className="bpm-node-priority">
            <span className="bpm-priority-badge">P{data.priority}</span>
          </div>
        )}
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
      {/* Task Properties */}
      {data.properties && Object.keys(data.properties).length > 0 && (
        <div className="bpm-node-properties">
          {data.properties.assignee && (
            <div className="bpm-property">
              <span className="bpm-property-label">Assignee:</span>
              <span className="bpm-property-value">{data.properties.assignee}</span>
            </div>
          )}
          {data.properties.dueDate && (
            <div className="bpm-property">
              <span className="bpm-property-label">Due:</span>
              <span className="bpm-property-value">{data.properties.dueDate}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="bpm-handle bpm-handle-input"
        style={{ background: '#3b82f6' }}
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="bpm-handle bpm-handle-output"
        style={{ background: '#10b981' }}
      />
      
      {/* Node Status */}
      {data.status && (
        <div className={`bpm-node-status bpm-status-${data.status}`}>
          <span 
            className="bpm-status-dot"
            style={{ backgroundColor: getStatusColor(data.status) }}
          ></span>
          {data.status}
        </div>
      )}
      
      {/* Execution Time */}
      {data.executionTime && (
        <div className="bpm-execution-time">
          <span className="bpm-icon">⏱️</span>
          {data.executionTime}
        </div>
      )}
    </div>
  );
});

export default BPMTaskNode;
