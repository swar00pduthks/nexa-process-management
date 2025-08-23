import React, { useState } from 'react';
import './DataSourcePanel.css';

const DataSourcePanel = ({ onRelationshipCreate, onProcessOrchestration }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [showRelationshipBuilder, setShowRelationshipBuilder] = useState(false);
  const [relationshipData, setRelationshipData] = useState({
    source1: null,
    source2: null,
    field1: '',
    field2: '',
    operator: 'equals'
  });

  const dataSources = [
    {
      id: 'customer_data',
      name: 'Customer Data',
      icon: '👥',
      description: 'Customer information and status',
      eventType: 'customer.refresh.completed',
      contextFields: ['businessDate', 'region', 'customerType', 'priority'],
      dataFields: ['customer_id', 'status', 'region', 'type', 'balance'],
      sampleContext: {
        businessDate: '2024-01-15',
        region: 'US-East',
        customerType: 'Enterprise',
        priority: 'High'
      }
    },
    {
      id: 'sales_data',
      name: 'Sales Data',
      icon: '💰',
      description: 'Sales transactions and revenue',
      eventType: 'sales.refresh.completed',
      contextFields: ['businessDate', 'region', 'salesChannel', 'currency'],
      dataFields: ['order_id', 'amount', 'customer_id', 'date', 'region'],
      sampleContext: {
        businessDate: '2024-01-15',
        region: 'US-East',
        salesChannel: 'Online',
        currency: 'USD'
      }
    },
    {
      id: 'inventory_data',
      name: 'Inventory Data',
      icon: '📦',
      description: 'Product inventory levels',
      eventType: 'inventory.refresh.completed',
      contextFields: ['businessDate', 'warehouse', 'productCategory'],
      dataFields: ['product_id', 'quantity', 'threshold', 'location'],
      sampleContext: {
        businessDate: '2024-01-15',
        warehouse: 'Main',
        productCategory: 'Electronics'
      }
    },
    {
      id: 'system_data',
      name: 'System Data',
      icon: '⚙️',
      description: 'System performance metrics',
      eventType: 'system.metrics.updated',
      contextFields: ['timestamp', 'environment', 'service'],
      dataFields: ['error_rate', 'response_time', 'cpu_usage', 'memory_usage'],
      sampleContext: {
        timestamp: '2024-01-15T10:30:00Z',
        environment: 'Production',
        service: 'API-Gateway'
      }
    }
  ];

  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSourceClick = (source) => {
    setSelectedSource(selectedSource?.id === source.id ? null : source);
    setShowRelationshipBuilder(false);
  };

  const handleCreateRelationship = () => {
    if (relationshipData.source1 && relationshipData.source2 && relationshipData.field1 && relationshipData.field2) {
      const relationship = {
        ...relationshipData,
        description: `When ${relationshipData.source1.name}.${relationshipData.field1} ${relationshipData.operator} ${relationshipData.source2.name}.${relationshipData.field2}`,
        suggestedProcess: `Trigger profit and loss calculator for ${relationshipData.field1} and ${relationshipData.field2}`
      };
      
      onRelationshipCreate(relationship);
      setShowRelationshipBuilder(false);
      setRelationshipData({ source1: null, source2: null, field1: '', field2: '', operator: 'equals' });
    }
  };

  const handleProcessOrchestration = () => {
    if (selectedSource) {
      onProcessOrchestration({
        source: selectedSource,
        suggestedProcesses: [
          `Daily ${selectedSource.name} Processing Pipeline`,
          `${selectedSource.name} Quality Check Workflow`,
          `${selectedSource.name} to Analytics Integration`
        ]
      });
    }
  };

  return (
    <div className="data-source-panel">
      <h3>📊 Available Data Sources</h3>
      
      <div className="data-sources-list">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className={`data-source-item ${selectedSource?.id === source.id ? 'selected' : ''}`}
            draggable
            onDragStart={(event) => onDragStart(event, 'conditionNode', {
              field: source.dataFields[0],
              operator: 'equals',
              value: '',
              sourceId: source.id,
              sourceName: source.name,
              contextFields: source.contextFields,
              dataFields: source.dataFields
            })}
            onClick={() => handleSourceClick(source)}
          >
            <div className="source-header">
              <span className="source-icon">{source.icon}</span>
              <span className="source-name">{source.name}</span>
            </div>
            <p className="source-description">{source.description}</p>
            
            <div className="source-details">
              <div className="event-info">
                <strong>Event Type:</strong> {source.eventType}
              </div>
              
              <div className="context-fields">
                <strong>Context Fields:</strong>
                <div className="fields-list">
                  {source.contextFields.map((field) => (
                    <span key={field} className="field-tag context-field">{field}</span>
                  ))}
                </div>
              </div>
              
              <div className="data-fields">
                <strong>Data Fields:</strong>
                <div className="fields-list">
                  {source.dataFields.map((field) => (
                    <span key={field} className="field-tag data-field">{field}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSource && (
        <div className="source-detail-panel">
          <h4>📋 {selectedSource.name} Details</h4>
          <div className="sample-context">
            <strong>Sample Context:</strong>
            <pre>{JSON.stringify(selectedSource.sampleContext, null, 2)}</pre>
          </div>
          
          <div className="source-actions">
            <button 
              className="btn-relationship"
              onClick={() => setShowRelationshipBuilder(true)}
            >
              🔗 Create Cross-Dataset Relationship
            </button>
            <button 
              className="btn-orchestration"
              onClick={handleProcessOrchestration}
            >
              🔄 Suggest Process Orchestration
            </button>
          </div>
        </div>
      )}

      {showRelationshipBuilder && (
        <div className="relationship-builder">
          <h4>🔗 Create Cross-Dataset Relationship</h4>
          <div className="relationship-form">
            <div className="form-group">
              <label>First Dataset:</label>
              <select 
                value={relationshipData.source1?.id || ''} 
                onChange={(e) => {
                  const source = dataSources.find(s => s.id === e.target.value);
                  setRelationshipData({...relationshipData, source1: source, field1: ''});
                }}
              >
                <option value="">Select Dataset</option>
                {dataSources.map(source => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            </div>
            
            {relationshipData.source1 && (
              <div className="form-group">
                <label>First Field:</label>
                <select 
                  value={relationshipData.field1} 
                  onChange={(e) => setRelationshipData({...relationshipData, field1: e.target.value})}
                >
                  <option value="">Select Field</option>
                  {[...relationshipData.source1.contextFields, ...relationshipData.source1.dataFields].map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label>Operator:</label>
              <select 
                value={relationshipData.operator} 
                onChange={(e) => setRelationshipData({...relationshipData, operator: e.target.value})}
              >
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Second Dataset:</label>
              <select 
                value={relationshipData.source2?.id || ''} 
                onChange={(e) => {
                  const source = dataSources.find(s => s.id === e.target.value);
                  setRelationshipData({...relationshipData, source2: source, field2: ''});
                }}
              >
                <option value="">Select Dataset</option>
                {dataSources.filter(s => s.id !== relationshipData.source1?.id).map(source => (
                  <option key={source.id} value={source.id}>{source.name}</option>
                ))}
              </select>
            </div>
            
            {relationshipData.source2 && (
              <div className="form-group">
                <label>Second Field:</label>
                <select 
                  value={relationshipData.field2} 
                  onChange={(e) => setRelationshipData({...relationshipData, field2: e.target.value})}
                >
                  <option value="">Select Field</option>
                  {[...relationshipData.source2.contextFields, ...relationshipData.source2.dataFields].map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="relationship-actions">
              <button 
                className="btn-create-relationship"
                onClick={handleCreateRelationship}
                disabled={!relationshipData.source1 || !relationshipData.source2 || !relationshipData.field1 || !relationshipData.field2}
              >
                Create Relationship
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setShowRelationshipBuilder(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="drag-instructions">
        <p>💡 Drag data sources to the canvas to create conditions</p>
        <p>🔗 Click on a source to create cross-dataset relationships</p>
      </div>
    </div>
  );
};

export default DataSourcePanel;
