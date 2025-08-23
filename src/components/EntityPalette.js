import React from 'react';
import './EntityPalette.css';

const EntityPalette = () => {
  const entities = [
    {
      id: 'customer_entity',
      name: 'Customer Entity',
      type: 'customer',
      icon: '👥',
      dataset: 'customer_data',
      attributes: [
        { name: 'customerId', type: 'string', category: 'event' },
        { name: 'status', type: 'string', category: 'event' },
        { name: 'balance', type: 'number', category: 'event' },
        { name: 'businessDate', type: 'date', category: 'context' },
        { name: 'region', type: 'string', category: 'context' },
        { name: 'customerType', type: 'string', category: 'context' }
      ]
    },
    {
      id: 'sales_entity',
      name: 'Sales Entity',
      type: 'sales',
      icon: '💰',
      dataset: 'sales_data',
      attributes: [
        { name: 'orderId', type: 'string', category: 'event' },
        { name: 'customerId', type: 'string', category: 'event' },
        { name: 'amount', type: 'number', category: 'event' },
        { name: 'businessDate', type: 'date', category: 'context' },
        { name: 'region', type: 'string', category: 'context' },
        { name: 'salesChannel', type: 'string', category: 'context' }
      ]
    },
    {
      id: 'inventory_entity',
      name: 'Inventory Entity',
      type: 'inventory',
      icon: '📦',
      dataset: 'inventory_data',
      attributes: [
        { name: 'productId', type: 'string', category: 'event' },
        { name: 'quantity', type: 'number', category: 'event' },
        { name: 'threshold', type: 'number', category: 'event' },
        { name: 'businessDate', type: 'date', category: 'context' },
        { name: 'warehouse', type: 'string', category: 'context' },
        { name: 'productCategory', type: 'string', category: 'context' }
      ]
    },
    {
      id: 'system_entity',
      name: 'System Entity',
      type: 'system',
      icon: '⚙️',
      dataset: 'system_data',
      attributes: [
        { name: 'errorRate', type: 'number', category: 'event' },
        { name: 'responseTime', type: 'number', category: 'event' },
        { name: 'cpuUsage', type: 'number', category: 'event' },
        { name: 'timestamp', type: 'datetime', category: 'context' },
        { name: 'environment', type: 'string', category: 'context' },
        { name: 'service', type: 'string', category: 'context' }
      ]
    }
  ];

  const onDragStart = (event, entity) => {
    event.dataTransfer.setData('application/reactflow', 'entityNode');
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify(entity));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragStartJoin = (event) => {
    event.dataTransfer.setData('application/reactflow', 'joinNode');
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify({
      name: 'Join Condition',
      type: 'join',
      icon: '🔗'
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragStartAction = (event) => {
    event.dataTransfer.setData('application/reactflow', 'actionNode');
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify({
      name: 'Action',
      type: 'action',
      icon: '⚡'
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="entity-palette">
      <h3>🎯 Available Entities</h3>
      <p className="palette-description">Drag entities to the canvas to build business rules</p>
      
      <div className="entities-list">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className="entity-item"
            draggable
            onDragStart={(event) => onDragStart(event, entity)}
          >
            <div className="entity-header">
              <span className="entity-icon">{entity.icon}</span>
              <span className="entity-name">{entity.name}</span>
            </div>
            
            <div className="entity-details">
              <div className="entity-type">
                <strong>Type:</strong> {entity.type}
              </div>
              <div className="entity-dataset">
                <strong>Dataset:</strong> {entity.dataset}
              </div>
              
              <div className="entity-attributes">
                <strong>Available Attributes:</strong>
                <div className="attributes-list">
                  {entity.attributes.map((attr) => (
                    <span 
                      key={attr.name} 
                      className={`attribute-tag ${attr.category}`}
                      title={`${attr.name} (${attr.type})`}
                    >
                      {attr.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="palette-section">
        <h4>🔗 Join & Action Nodes</h4>
        <p className="section-description">Add these to specify conditions and actions</p>
        
        <div className="node-items">
          <div
            className="node-item join-node"
            draggable
            onDragStart={onDragStartJoin}
          >
            <div className="node-header">
              <span className="node-icon">🔗</span>
              <span className="node-name">Join Condition</span>
            </div>
            <div className="node-description">
              Specify conditions to join entities (e.g., customer.businessDate = sales.businessDate)
            </div>
          </div>

          <div
            className="node-item action-node"
            draggable
            onDragStart={onDragStartAction}
          >
            <div className="node-header">
              <span className="node-icon">⚡</span>
              <span className="node-name">Action</span>
            </div>
            <div className="node-description">
              Define what happens when conditions are met (e.g., trigger task, send notification)
            </div>
          </div>
        </div>
      </div>

      <div className="palette-instructions">
        <h4>📋 How to Use:</h4>
        <ol>
          <li>Drag entities to the canvas</li>
          <li>Add a Join Condition node</li>
          <li>Connect entities to the Join node</li>
          <li>Configure join conditions</li>
          <li>Add an Action node</li>
          <li>Connect Join to Action</li>
          <li>Generate configuration</li>
        </ol>
      </div>
    </div>
  );
};

export default EntityPalette;
