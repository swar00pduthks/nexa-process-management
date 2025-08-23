import React from 'react';
import { Handle, Position } from 'reactflow';
import './nodes.css';

const EntityNode = ({ data }) => {
  const eventAttributes = data.attributes?.filter(attr => attr.category === 'event') || [];
  const contextAttributes = data.attributes?.filter(attr => attr.category === 'context') || [];

  return (
    <div className="entity-node">
      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle"
      />
      
      <div className="node-content">
        <div className="node-header">
          <span className="node-icon">{data.icon || '📊'}</span>
          <span className="node-title">{data.label}</span>
        </div>
        
        <div className="node-body">
          <div className="entity-info">
            <div className="entity-type">
              <strong>Type:</strong> {data.entityType}
            </div>
            <div className="entity-dataset">
              <strong>Dataset:</strong> {data.dataset}
            </div>
          </div>
          
          <div className="attributes-section">
            <div className="attributes-group">
              <div className="attributes-label">Event Data:</div>
              <div className="attributes-list">
                {eventAttributes.slice(0, 3).map((attr) => (
                  <span key={attr.name} className="attribute-tag event">
                    {attr.name}
                  </span>
                ))}
                {eventAttributes.length > 3 && (
                  <span className="attribute-tag event">+{eventAttributes.length - 3}</span>
                )}
              </div>
            </div>
            
            <div className="attributes-group">
              <div className="attributes-label">Context Data:</div>
              <div className="attributes-list">
                {contextAttributes.slice(0, 3).map((attr) => (
                  <span key={attr.name} className="attribute-tag context">
                    {attr.name}
                  </span>
                ))}
                {contextAttributes.length > 3 && (
                  <span className="attribute-tag context">+{contextAttributes.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityNode;
