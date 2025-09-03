import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const ConditionNode = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [condition, setCondition] = useState(data.condition || '');
  const [operator, setOperator] = useState(data.operator || 'equals');
  const [value, setValue] = useState(data.value || '');

  const operators = [
    { value: 'equals', label: '=', icon: '=' },
    { value: 'not_equals', label: '≠', icon: '≠' },
    { value: 'greater_than', label: '>', icon: '>' },
    { value: 'less_than', label: '<', icon: '<' },
    { value: 'greater_equal', label: '≥', icon: '≥' },
    { value: 'less_equal', label: '≤', icon: '≤' },
    { value: 'contains', label: 'contains', icon: '⊃' },
    { value: 'starts_with', label: 'starts with', icon: '→' },
    { value: 'ends_with', label: 'ends with', icon: '←' }
  ];

  const handleSave = () => {
    data.condition = condition;
    data.operator = operator;
    data.value = value;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCondition(data.condition || '');
    setOperator(data.operator || 'equals');
    setValue(data.value || '');
    setIsEditing(false);
  };

  const getOperatorIcon = (op) => {
    const found = operators.find(o => o.value === op);
    return found ? found.icon : '=';
  };

  return (
    <div className="condition-node">
      <Handle
        type="target"
        position={Position.Left}
        className="react-flow__handle"
        isConnectable={isConnectable}
      />
      
      <div className="node-header">
        <div className="node-icon">
          <span className="condition-icon">🔍</span>
        </div>
        <div className="node-content">
          <div className="node-title">{data.label || 'Condition'}</div>
          <div className="node-type">Business Rule</div>
        </div>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Edit condition"
        >
          ✏️
        </button>
      </div>

      {isEditing ? (
        <div className="condition-edit">
          <div className="edit-row">
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Field name (e.g., amount, status)"
              className="condition-input"
            />
          </div>
          
          <div className="edit-row">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="operator-select"
            >
              {operators.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value"
              className="value-input"
            />
          </div>
          
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              ✓ Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              ✗ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="condition-display">
          <div className="condition-expression">
            <span className="condition-field">{condition || 'field'}</span>
            <span className="condition-operator">
              {getOperatorIcon(operator)}
            </span>
            <span className="condition-value">{value || 'value'}</span>
          </div>
          
          {data.description && (
            <div className="condition-description">
              {data.description}
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="react-flow__handle"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ConditionNode;
