import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import './ProcessFlowVisualizer.css';

// Phase Node Component
const PhaseNode = ({ data }) => {
  const getPhaseIcon = (phaseType) => {
    const icons = {
      'start': '🚀',
      'process': '⚙️',
      'decision': '🔍',
      'action': '⚡',
      'notification': '🔔',
      'calculation': '🧮',
      'end': '✅'
    };
    return icons[phaseType] || '📋';
  };

  const getPhaseColor = (phaseType) => {
    const colors = {
      'start': '#10b981',
      'process': '#3b82f6',
      'decision': '#f59e0b',
      'action': '#8b5cf6',
      'notification': '#06b6d4',
      'calculation': '#84cc16',
      'end': '#ef4444'
    };
    return colors[phaseType] || '#6b7280';
  };

  return (
    <div className="phase-node" style={{ borderColor: getPhaseColor(data.phaseType) }}>
      <div className="phase-header">
        <div className="phase-icon" style={{ backgroundColor: getPhaseColor(data.phaseType) + '20' }}>
          <span>{getPhaseIcon(data.phaseType)}</span>
        </div>
        <div className="phase-content">
          <div className="phase-title">{data.label}</div>
          <div className="phase-type">{data.phaseType}</div>
        </div>
      </div>
      
      {data.conditions && data.conditions.length > 0 && (
        <div className="phase-conditions">
          <div className="conditions-label">Conditions:</div>
          <div className="conditions-list">
            {data.conditions.map((condition, index) => (
              <div key={index} className="condition-item">
                <span className="condition-field">{condition.field}</span>
                <span className="condition-operator">{condition.operator}</span>
                <span className="condition-value">{condition.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.actions && data.actions.length > 0 && (
        <div className="phase-actions">
          <div className="actions-label">Actions:</div>
          <div className="actions-list">
            {data.actions.map((action, index) => (
              <div key={index} className="action-item">
                <span className="action-icon">⚡</span>
                <span className="action-name">{action.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.description && (
        <div className="phase-description">
          {data.description}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  phaseNode: PhaseNode
};

const ProcessFlowVisualizer = ({ naturalLanguageInput, generatedRule }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [processPhases, setProcessPhases] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Parse natural language input to extract phases
  const parsePhasesFromInput = useCallback((input) => {
    if (!input.trim()) return [];

    const phases = [];
    const lines = input.split(/[.!?]+/).filter(line => line.trim());
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Determine phase type based on content
      let phaseType = 'process';
      if (trimmedLine.toLowerCase().includes('start') || trimmedLine.toLowerCase().includes('begin')) {
        phaseType = 'start';
      } else if (trimmedLine.toLowerCase().includes('if') || trimmedLine.toLowerCase().includes('when')) {
        phaseType = 'decision';
      } else if (trimmedLine.toLowerCase().includes('trigger') || trimmedLine.toLowerCase().includes('action')) {
        phaseType = 'action';
      } else if (trimmedLine.toLowerCase().includes('calculate') || trimmedLine.toLowerCase().includes('compute')) {
        phaseType = 'calculation';
      } else if (trimmedLine.toLowerCase().includes('notify') || trimmedLine.toLowerCase().includes('send')) {
        phaseType = 'notification';
      } else if (trimmedLine.toLowerCase().includes('end') || trimmedLine.toLowerCase().includes('complete')) {
        phaseType = 'end';
      }

      // Extract conditions
      const conditions = [];
      const conditionMatches = trimmedLine.match(/(?:if|when)\s+(.+?)\s+(?:then|,|and|or)/gi);
      if (conditionMatches) {
        conditionMatches.forEach(match => {
          const conditionText = match.replace(/(?:if|when)\s+/i, '').replace(/\s+(?:then|,|and|or)/i, '');
          const parts = conditionText.split(/\s+(?:is|equals|greater|less|contains|exceeds)\s+/i);
          if (parts.length >= 2) {
            conditions.push({
              field: parts[0].trim(),
              operator: 'equals',
              value: parts[1].trim()
            });
          }
        });
      }

      // Extract actions
      const actions = [];
      const actionMatches = trimmedLine.match(/(?:trigger|create|send|escalate|notify)\s+([^,\s]+)/gi);
      if (actionMatches) {
        actionMatches.forEach(match => {
          const actionName = match.replace(/(?:trigger|create|send|escalate|notify)\s+/i, '');
          actions.push({
            name: actionName.trim(),
            type: 'action'
          });
        });
      }

      phases.push({
        id: `phase-${index + 1}`,
        name: `Phase ${index + 1}`,
        type: phaseType,
        description: trimmedLine,
        conditions,
        actions,
        dependencies: []
      });
    });

    return phases;
  }, []);

  // Generate visual flow from phases
  const generateVisualFlow = useCallback((phases) => {
    if (phases.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const visualNodes = [];
    const visualEdges = [];
    const nodeSpacing = 200;
    const verticalSpacing = 150;

    phases.forEach((phase, index) => {
      // Calculate position
      const x = (index % 3) * nodeSpacing + 100;
      const y = Math.floor(index / 3) * verticalSpacing + 100;

      // Create node
      visualNodes.push({
        id: phase.id,
        type: 'phaseNode',
        position: { x, y },
        data: {
          label: phase.name,
          phaseType: phase.type,
          description: phase.description,
          conditions: phase.conditions,
          actions: phase.actions
        }
      });

      // Create edges for dependencies
      if (index > 0) {
        const prevPhase = phases[index - 1];
        
        // Check if there's a dependency (sequential) or parallel
        const isSequential = phase.description.toLowerCase().includes('after') || 
                           phase.description.toLowerCase().includes('then') ||
                           phase.description.toLowerCase().includes('completion');
        
        if (isSequential) {
          visualEdges.push({
            id: `edge-${prevPhase.id}-${phase.id}`,
            source: prevPhase.id,
            target: phase.id,
            type: 'smoothstep',
            style: { stroke: '#10b981', strokeWidth: 3 },
            label: 'Sequential',
            labelStyle: { fill: '#10b981', fontWeight: 600 }
          });
        } else {
          // Parallel execution - connect to start node
          if (index === 1) {
            visualEdges.push({
              id: `edge-start-${phase.id}`,
              source: phases[0].id,
              target: phase.id,
              type: 'smoothstep',
              style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' },
              label: 'Parallel',
              labelStyle: { fill: '#3b82f6', fontWeight: 600 }
            });
          }
        }
      }
    });

    setNodes(visualNodes);
    setEdges(visualEdges);
  }, [setNodes, setEdges]);

  // Update flow when input changes
  useEffect(() => {
    const phases = parsePhasesFromInput(naturalLanguageInput);
    setProcessPhases(phases);
    generateVisualFlow(phases);
  }, [naturalLanguageInput, parsePhasesFromInput, generateVisualFlow]);

  // Update flow when generated rule changes
  useEffect(() => {
    if (generatedRule) {
      const phases = parsePhasesFromInput(generatedRule.description || '');
      setProcessPhases(phases);
      generateVisualFlow(phases);
    }
  }, [generatedRule, parsePhasesFromInput, generateVisualFlow]);

  if (nodes.length === 0) {
    return (
      <div className="process-flow-visualizer">
        <div className="visualizer-header">
          <h3>🔄 Process Flow Visualizer</h3>
          <p className="visualizer-subtitle">Real-time visualization of your business process phases</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h4>Start typing to see your process flow</h4>
          <p>Enter your business process description in natural language to see phases visualized as nodes with dependencies and parallel execution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="process-flow-visualizer">
      <div className="visualizer-header">
        <h3>🔄 Process Flow Visualizer</h3>
        <div className="visualizer-stats">
          <span className="stat-item">
            <span className="stat-label">Phases:</span>
            <span className="stat-value">{nodes.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Dependencies:</span>
            <span className="stat-value">{edges.length}</span>
          </span>
        </div>
      </div>
      
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultZoom={0.8}
          style={{ width: '100%', height: '400px' }}
        >
          <Controls />
          <MiniMap
            nodeColor={() => '#111827'}
            style={{ background: '#f8fafc' }}
          />
          <Background variant="dots" gap={20} size={1} />
        </ReactFlow>
      </div>
      
      <div className="phase-summary">
        <h4>Phase Summary</h4>
        <div className="phases-list">
          {processPhases.map((phase, index) => (
            <div key={phase.id} className="phase-summary-item">
              <div className="phase-summary-header">
                <span className="phase-number">{index + 1}</span>
                <span className="phase-name">{phase.name}</span>
                <span className="phase-type-badge">{phase.type}</span>
              </div>
              <div className="phase-summary-description">{phase.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowVisualizer;


