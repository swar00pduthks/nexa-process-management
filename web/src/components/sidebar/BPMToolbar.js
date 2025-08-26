import React, { useState } from 'react';
import './BPMToolbar.css';

const BPMToolbar = ({ onAddNode, viewMode, onStartInstance }) => {
  const [activeCategory, setActiveCategory] = useState('events');

  const nodeCategories = {
    events: [
      { type: 'start', label: 'Start Event', icon: '▶️', description: 'Process start point' },
      { type: 'end', label: 'End Event', icon: '⏹️', description: 'Process end point' },
      { type: 'event', label: 'Intermediate Event', icon: '⚡', description: 'Intermediate event' },
    ],
    tasks: [
      { type: 'task', label: 'User Task', icon: '👤', description: 'Human task', taskType: 'user-task' },
      { type: 'task', label: 'Service Task', icon: '⚙️', description: 'Automated service', taskType: 'service-task' },
      { type: 'task', label: 'Script Task', icon: '📝', description: 'Script execution', taskType: 'script-task' },
      { type: 'task', label: 'Manual Task', icon: '✋', description: 'Manual activity', taskType: 'manual-task' },
      { type: 'task', label: 'Business Rule', icon: '📋', description: 'Business rule task', taskType: 'business-rule-task' },
    ],
    gateways: [
      { type: 'gateway', label: 'Exclusive Gateway', icon: '🔀', description: 'XOR decision', gatewayType: 'exclusive' },
      { type: 'gateway', label: 'Inclusive Gateway', icon: '🔀', description: 'OR decision', gatewayType: 'inclusive' },
      { type: 'gateway', label: 'Parallel Gateway', icon: '⫴', description: 'AND split/join', gatewayType: 'parallel' },
      { type: 'gateway', label: 'Event Gateway', icon: '⚡', description: 'Event-based decision', gatewayType: 'event-based' },
    ],
    subprocesses: [
      { type: 'subprocess', label: 'Subprocess', icon: '📦', description: 'Embedded subprocess', subprocessType: 'embedded' },
      { type: 'subprocess', label: 'Call Activity', icon: '📞', description: 'Call external process', subprocessType: 'call' },
    ],
  };

  const handleDragStart = (event, nodeType, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      data: nodeData,
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeData) => {
    const position = { x: Math.random() * 400, y: Math.random() * 400 };
    onAddNode(nodeData.type, position, nodeData);
  };

  return (
    <div className="bpm-toolbar">
      <div className="bpm-toolbar-header">
        <h3 className="bpm-toolbar-title">Process Elements</h3>
        {viewMode === 'execute' && (
          <button className="bpm-btn bpm-btn-primary" onClick={onStartInstance}>
            <span className="bpm-icon">▶️</span>
            Start Instance
          </button>
        )}
      </div>

      <div className="bpm-toolbar-categories">
        {Object.entries(nodeCategories).map(([category, nodes]) => (
          <div key={category} className="bpm-category">
            <button
              className={`bpm-category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="bpm-category-icon">
                {category === 'events' && '⚡'}
                {category === 'tasks' && '📋'}
                {category === 'gateways' && '🔀'}
                {category === 'subprocesses' && '📦'}
              </span>
              <span className="bpm-category-label">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="bpm-toolbar-content">
        <div className="bpm-elements-list">
          {nodeCategories[activeCategory].map((node, index) => (
            <div
              key={index}
              className="bpm-element-item"
              draggable
              onDragStart={(e) => handleDragStart(e, node.type, node)}
              onClick={() => handleAddNode(node)}
            >
              <div className="bpm-element-icon">
                <span className="bpm-icon">{node.icon}</span>
              </div>
              <div className="bpm-element-info">
                <div className="bpm-element-label">{node.label}</div>
                <div className="bpm-element-description">{node.description}</div>
              </div>
              <div className="bpm-element-actions">
                <button className="bpm-element-btn">
                  <span className="bpm-icon">➕</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bpm-quick-actions">
        <h4 className="bpm-quick-actions-title">Quick Actions</h4>
        <div className="bpm-quick-actions-list">
          <button className="bpm-quick-action-btn">
            <span className="bpm-icon">🔍</span>
            Validate Process
          </button>
          <button className="bpm-quick-action-btn">
            <span className="bpm-icon">📊</span>
            Generate Report
          </button>
          <button className="bpm-quick-action-btn">
            <span className="bpm-icon">📋</span>
            Export BPMN
          </button>
          <button className="bpm-quick-action-btn">
            <span className="bpm-icon">🔄</span>
            Import BPMN
          </button>
        </div>
      </div>

      {/* Process Templates */}
      <div className="bpm-templates">
        <h4 className="bpm-templates-title">Templates</h4>
        <div className="bpm-templates-list">
          <button className="bpm-template-btn">
            <span className="bpm-icon">📋</span>
            Approval Process
          </button>
          <button className="bpm-template-btn">
            <span className="bpm-icon">💰</span>
            Invoice Processing
          </button>
          <button className="bpm-template-btn">
            <span className="bpm-icon">👤</span>
            Onboarding
          </button>
          <button className="bpm-template-btn">
            <span className="bpm-icon">🛠️</span>
            Incident Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default BPMToolbar;
