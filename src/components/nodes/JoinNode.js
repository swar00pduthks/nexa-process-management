import React from 'react';
import { Handle, Position } from 'reactflow';
import './nodes.css';

const JoinNode = ({ data }) => {
  return (
    <div className="join-node">
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="react-flow__handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle"
      />
      
      <div className="node-content">
        <div className="node-header">
          <span className="node-icon">🔗</span>
          <span className="node-title">{data.label}</span>
        </div>
        
        <div className="node-body">
          <div className="join-info">
            <div className="join-description">
              <strong>Join Conditions:</strong>
            </div>
            
            {data.joinConditions && data.joinConditions.length > 0 ? (
              <div className="join-conditions">
                {data.joinConditions.map((condition, index) => (
                  <div key={index} className="join-condition">
                    <span className="condition-text">{condition}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-conditions">
                <span>No join conditions defined</span>
                <span className="hint">Click to configure</span>
              </div>
            )}
          </div>
          
          {data.contextMapping && Object.keys(data.contextMapping).length > 0 && (
            <div className="context-mapping">
              <div className="mapping-label">
                <strong>Context Mapping:</strong>
              </div>
              <div className="mapping-list">
                {Object.entries(data.contextMapping).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="mapping-item">
                    <span className="mapping-key">{key}</span>
                    <span className="mapping-arrow">←</span>
                    <span className="mapping-value">{value}</span>
                  </div>
                ))}
                {Object.keys(data.contextMapping).length > 3 && (
                  <div className="mapping-more">
                    +{Object.keys(data.contextMapping).length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinNode;
