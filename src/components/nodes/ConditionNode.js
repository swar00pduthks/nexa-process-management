import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './nodes.css';

const ConditionNode = memo(({ data, isConnectable }) => {
  const handleFieldChange = (value) => {
    if (data.onFieldChange) {
      data.onFieldChange(value);
    }
  };

  const handleOperatorChange = (value) => {
    if (data.onOperatorChange) {
      data.onOperatorChange(value);
    }
  };

  const handleValueChange = (value) => {
    if (data.onValueChange) {
      data.onValueChange(value);
    }
  };

  return (
    <div className="condition-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="node-content">
        <div className="node-header">
          <span className="node-icon">📊</span>
          <span className="node-title">Condition</span>
        </div>
        
        <div className="node-body">
          <div className="field-selector">
            <label>Field:</label>
            <select 
              value={data.field || ''} 
              onChange={(e) => handleFieldChange(e.target.value)}
            >
              <option value="">Select Field</option>
              <option value="customer_status">Customer Status</option>
              <option value="sales_amount">Sales Amount</option>
              <option value="inventory_quantity">Inventory Quantity</option>
              <option value="order_count">Order Count</option>
              <option value="revenue">Revenue</option>
              <option value="error_rate">Error Rate</option>
              <option value="business_date">Business Date</option>
              <option value="region">Region</option>
            </select>
          </div>
          
          <div className="operator-selector">
            <label>Operator:</label>
            <select 
              value={data.operator || 'equals'} 
              onChange={(e) => handleOperatorChange(e.target.value)}
            >
              <option value="equals">equals</option>
              <option value="not_equals">not equals</option>
              <option value="greater_than">greater than</option>
              <option value="less_than">less than</option>
              <option value="contains">contains</option>
              <option value="is_empty">is empty</option>
              <option value="is_not_empty">is not empty</option>
            </select>
          </div>
          
          <div className="value-input">
            <label>Value:</label>
            <input
              type="text"
              value={data.value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Enter value"
            />
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

export default ConditionNode;
