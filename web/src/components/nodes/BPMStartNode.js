import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMStartNode = memo(({ data, selected }) => {
  return (
    <div className={`bpm-node bpm-start-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span className="bpm-icon">▶️</span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'Start Event'}
        </div>
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
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
          <span className="bpm-status-dot"></span>
          {data.status}
        </div>
      )}
    </div>
  );
});

export default BPMStartNode;
