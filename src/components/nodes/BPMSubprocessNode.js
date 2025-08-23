import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const BPMSubprocessNode = memo(({ data, selected }) => {
  return (
    <div className={`bpm-node bpm-subprocess-node ${selected ? 'selected' : ''}`}>
      <div className="bpm-node-header">
        <div className="bpm-node-icon">
          <span className="bpm-icon">📦</span>
        </div>
        <div className="bpm-node-title">
          {data.label || 'Subprocess'}
        </div>
        <div className="bpm-subprocess-type">
          {data.subprocessType || 'embedded'}
        </div>
      </div>
      
      {data.description && (
        <div className="bpm-node-description">
          {data.description}
        </div>
      )}
      
      {/* Subprocess Properties */}
      {data.properties && Object.keys(data.properties).length > 0 && (
        <div className="bpm-node-properties">
          {data.properties.processId && (
            <div className="bpm-property">
              <span className="bpm-property-label">Process ID:</span>
              <span className="bpm-property-value">{data.properties.processId}</span>
            </div>
          )}
          {data.properties.version && (
            <div className="bpm-property">
              <span className="bpm-property-label">Version:</span>
              <span className="bpm-property-value">{data.properties.version}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="bpm-handle bpm-handle-input"
        style={{ background: '#374151' }}
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
          <span className="bpm-status-dot"></span>
          {data.status}
        </div>
      )}
      
      {/* Subprocess Progress */}
      {data.progress && (
        <div className="bpm-subprocess-progress">
          <div className="bpm-progress-bar">
            <div 
              className="bpm-progress-fill"
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>
          <span className="bpm-progress-text">{data.progress}%</span>
        </div>
      )}
    </div>
  );
});

export default BPMSubprocessNode;
