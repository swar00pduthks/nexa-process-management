import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMEndNode = memo(({ data, selected }) => {
  return (
    <div className={`bpm-node bpm-end-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span className="bpm-icon">⏹️</span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'End Event'}
        </div>
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="bpm-handle bpm-handle-input"
        style={{ background: '#ef4444' }}
      />
      
      {/* Node Status */}
      {data.status && (
        <div className={`bpm-node-status bpm-status-${data.status}`}>
          <span className="bpm-status-dot"></span>
          {data.status}
        </div>
      )}
      
      {/* Completion Time */}
      {data.completionTime && (
        <div className="bpm-execution-time">
          <span className="bpm-icon">✅</span>
          Completed at {data.completionTime}
        </div>
      )}
    </div>
  );
});

export default BPMEndNode;
