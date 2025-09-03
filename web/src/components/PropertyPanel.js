import React, { useState, useEffect } from 'react';
import './PropertyPanel.css';

const PropertyPanel = ({ node, onUpdate, onClose }) => {
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    setLocalData(node.data);
  }, [node]);

  const handleSave = () => {
    onUpdate(node.id, localData);
    onClose();
  };

  const handleCancel = () => {
    setLocalData(node.data);
    onClose();
  };

  const renderEntityNodeProperties = () => (
    <div className="property-section">
      <h4>Entity Configuration</h4>
      
      <div className="form-group">
        <label>Entity Name:</label>
        <input
          type="text"
          value={localData.label || ''}
          onChange={(e) => setLocalData({ ...localData, label: e.target.value })}
          placeholder="Enter entity name"
        />
      </div>

      <div className="form-group">
        <label>Selected Attributes:</label>
        <div className="attributes-selector">
          {localData.attributes?.map((attr) => (
            <label key={attr.name} className="attribute-checkbox">
              <input
                type="checkbox"
                checked={localData.selectedAttributes?.includes(attr.name) || false}
                onChange={(e) => {
                  const selected = localData.selectedAttributes || [];
                  if (e.target.checked) {
                    setLocalData({
                      ...localData,
                      selectedAttributes: [...selected, attr.name]
                    });
                  } else {
                    setLocalData({
                      ...localData,
                      selectedAttributes: selected.filter(a => a !== attr.name)
                    });
                  }
                }}
              />
              <span className={`attribute-tag ${attr.category}`}>
                {attr.name} ({attr.type})
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderJoinNodeProperties = () => (
    <div className="property-section">
      <h4>Join Configuration</h4>
      
      <div className="form-group">
        <label>Join Conditions:</label>
        <div className="join-conditions-builder">
          {localData.joinConditions?.map((condition, index) => (
            <div key={index} className="join-condition-item">
              <input
                type="text"
                value={condition}
                onChange={(e) => {
                  const conditions = [...(localData.joinConditions || [])];
                  conditions[index] = e.target.value;
                  setLocalData({ ...localData, joinConditions: conditions });
                }}
                placeholder="e.g., customer.customerId = sales.customerId"
              />
              <button
                className="remove-condition"
                onClick={() => {
                  const conditions = localData.joinConditions?.filter((_, i) => i !== index) || [];
                  setLocalData({ ...localData, joinConditions: conditions });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="add-condition"
            onClick={() => {
              const conditions = [...(localData.joinConditions || []), ''];
              setLocalData({ ...localData, joinConditions: conditions });
            }}
          >
            + Add Condition
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Context Mapping:</label>
        <div className="context-mapping-builder">
          {Object.entries(localData.contextMapping || {}).map(([key, value], index) => (
            <div key={index} className="mapping-item">
              <input
                type="text"
                value={key}
                placeholder="New context field"
                onChange={(e) => {
                  const mapping = { ...localData.contextMapping };
                  delete mapping[key];
                  mapping[e.target.value] = value;
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              />
              <span className="mapping-arrow">←</span>
              <input
                type="text"
                value={value}
                placeholder="Source field"
                onChange={(e) => {
                  const mapping = { ...localData.contextMapping };
                  mapping[key] = e.target.value;
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              />
              <button
                className="remove-mapping"
                onClick={() => {
                  const mapping = { ...localData.contextMapping };
                  delete mapping[key];
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="add-mapping"
            onClick={() => {
              const mapping = { ...localData.contextMapping, '': '' };
              setLocalData({ ...localData, contextMapping: mapping });
            }}
          >
            + Add Mapping
          </button>
        </div>
      </div>
    </div>
  );

  const renderActionNodeProperties = () => (
    <div className="property-section">
      <h4>Action Configuration</h4>
      
      <div className="form-group">
        <label>Task Name:</label>
        <input
          type="text"
          value={localData.taskName || ''}
          onChange={(e) => setLocalData({ ...localData, taskName: e.target.value })}
          placeholder="e.g., Profit Calculator"
        />
      </div>

      <div className="form-group">
        <label>Trigger Event:</label>
        <input
          type="text"
          value={localData.triggerEvent || ''}
          onChange={(e) => setLocalData({ ...localData, triggerEvent: e.target.value })}
          placeholder="e.g., customer-sales-join-complete"
        />
      </div>

      <div className="form-group">
        <label>Event Data:</label>
        <div className="event-data-builder">
          {Object.entries(localData.eventData || {}).map(([key, value], index) => (
            <div key={index} className="event-data-item">
              <input
                type="text"
                value={key}
                placeholder="Event field name"
                onChange={(e) => {
                  const eventData = { ...localData.eventData };
                  delete eventData[key];
                  eventData[e.target.value] = value;
                  setLocalData({ ...localData, eventData });
                }}
              />
              <span className="mapping-arrow">:</span>
              <input
                type="text"
                value={value}
                placeholder="Event field value or expression"
                onChange={(e) => {
                  const eventData = { ...localData.eventData };
                  eventData[key] = e.target.value;
                  setLocalData({ ...localData, eventData });
                }}
              />
              <button
                className="remove-mapping"
                onClick={() => {
                  const eventData = { ...localData.eventData };
                  delete eventData[key];
                  setLocalData({ ...localData, eventData });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="add-mapping"
            onClick={() => {
              const eventData = { ...localData.eventData, '': '' };
              setLocalData({ ...localData, eventData });
            }}
          >
            + Add Event Field
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Context Mapping:</label>
        <div className="context-mapping-builder">
          {Object.entries(localData.contextMapping || {}).map(([key, value], index) => (
            <div key={index} className="mapping-item">
              <input
                type="text"
                value={key}
                placeholder="Task context field"
                onChange={(e) => {
                  const mapping = { ...localData.contextMapping };
                  delete mapping[key];
                  mapping[e.target.value] = value;
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              />
              <span className="mapping-arrow">←</span>
              <input
                type="text"
                value={value}
                placeholder="Source field"
                onChange={(e) => {
                  const mapping = { ...localData.contextMapping };
                  mapping[key] = e.target.value;
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              />
              <button
                className="remove-mapping"
                onClick={() => {
                  const mapping = { ...localData.contextMapping };
                  delete mapping[key];
                  setLocalData({ ...localData, contextMapping: mapping });
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="add-mapping"
            onClick={() => {
              const mapping = { ...localData.contextMapping, '': '' };
              setLocalData({ ...localData, contextMapping: mapping });
            }}
          >
            + Add Mapping
          </button>
        </div>
      </div>
    </div>
  );

  const renderNodeProperties = () => {
    switch (node.type) {
      case 'entityNode':
        return renderEntityNodeProperties();
      case 'joinNode':
        return renderJoinNodeProperties();
      case 'actionNode':
        return renderActionNodeProperties();
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="property-panel-overlay">
      <div className="property-panel">
        <div className="panel-header">
          <h3>⚙️ {node.data.label} Properties</h3>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>
        
        <div className="panel-content">
          {renderNodeProperties()}
        </div>
        
        <div className="panel-actions">
          <button className="btn-save" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
