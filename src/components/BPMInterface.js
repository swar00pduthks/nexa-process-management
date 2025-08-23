import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './BPMInterface.css';

// Custom Node Components
import BPMStartNode from './nodes/BPMStartNode';
import BPMTaskNode from './nodes/BPMTaskNode';
import BPMGatewayNode from './nodes/BPMGatewayNode';
import BPMEndNode from './nodes/BPMEndNode';
import BPMSubprocessNode from './nodes/BPMSubprocessNode';
import BPMEventNode from './nodes/BPMEventNode';

// Sidebar Components
import BPMToolbar from './sidebar/BPMToolbar';
import BPMPropertiesPanel from './sidebar/BPMPropertiesPanel';
import BPMExecutionPanel from './sidebar/BPMExecutionPanel';

// Modal Components
import BPMProcessModal from './modals/BPMProcessModal';
import BPMTaskModal from './modals/BPMTaskModal';
import BPMConditionModal from './modals/BPMConditionModal';

const nodeTypes = {
  bpmStart: BPMStartNode,
  bpmTask: BPMTaskNode,
  bpmGateway: BPMGatewayNode,
  bpmEnd: BPMEndNode,
  bpmSubprocess: BPMSubprocessNode,
  bpmEvent: BPMEventNode,
};

const BPMInterface = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [processData, setProcessData] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    category: 'Business Process',
  });
  const [executionData, setExecutionData] = useState({
    instances: [],
    statistics: {
      total: 0,
      running: 0,
      completed: 0,
      failed: 0,
    },
  });
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [viewMode, setViewMode] = useState('design'); // 'design', 'monitor', 'execute'

  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const addNode = (type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: `bpm${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position,
      data: {
        label: `New ${type}`,
        type: type,
        properties: {},
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateNodeData = (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const saveProcess = () => {
    const processDefinition = {
      ...processData,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('Saving process:', processDefinition);
    // TODO: Save to backend
  };

  const deployProcess = () => {
    console.log('Deploying process...');
    // TODO: Deploy to execution engine
  };

  const startProcessInstance = () => {
    const instance = {
      id: `instance-${Date.now()}`,
      processId: processData.name,
      status: 'running',
      startTime: new Date().toISOString(),
      variables: {},
    };
    setExecutionData((prev) => ({
      ...prev,
      instances: [...prev.instances, instance],
      statistics: {
        ...prev.statistics,
        total: prev.statistics.total + 1,
        running: prev.statistics.running + 1,
      },
    }));
  };

  return (
    <div className="bpm-interface">
      {/* Top Navigation Bar */}
      <div className="bpm-header">
        <div className="bpm-header-left">
          <h1 className="bpm-title">Nexa Business Process Management</h1>
          <div className="bpm-breadcrumb">
            <span>Processes</span>
            <span className="bpm-breadcrumb-separator">/</span>
            <span>{processData.name || 'Untitled Process'}</span>
          </div>
        </div>
        <div className="bpm-header-right">
          <div className="bpm-view-mode">
            <button
              className={`bpm-view-btn ${viewMode === 'design' ? 'active' : ''}`}
              onClick={() => setViewMode('design')}
            >
              <span className="bpm-icon">🎨</span>
              Design
            </button>
            <button
              className={`bpm-view-btn ${viewMode === 'monitor' ? 'active' : ''}`}
              onClick={() => setViewMode('monitor')}
            >
              <span className="bpm-icon">📊</span>
              Monitor
            </button>
            <button
              className={`bpm-view-btn ${viewMode === 'execute' ? 'active' : ''}`}
              onClick={() => setViewMode('execute')}
            >
              <span className="bpm-icon">▶️</span>
              Execute
            </button>
          </div>
          <div className="bpm-actions">
            <button className="bpm-btn bpm-btn-secondary" onClick={() => setShowProcessModal(true)}>
              <span className="bpm-icon">⚙️</span>
              Process Settings
            </button>
            <button className="bpm-btn bpm-btn-primary" onClick={saveProcess}>
              <span className="bpm-icon">💾</span>
              Save
            </button>
            <button className="bpm-btn bpm-btn-success" onClick={deployProcess}>
              <span className="bpm-icon">🚀</span>
              Deploy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bpm-main">
        {/* Left Sidebar - Toolbar */}
        <div className="bpm-sidebar bpm-sidebar-left">
          <BPMToolbar
            onAddNode={addNode}
            viewMode={viewMode}
            onStartInstance={startProcessInstance}
          />
        </div>

        {/* Center - Canvas */}
        <div className="bpm-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bpm-reactflow"
          >
            <Controls className="bpm-controls" />
            <Background className="bpm-background" />
            <MiniMap className="bpm-minimap" />
            
            {/* Canvas Toolbar */}
            <Panel position="top-left" className="bpm-canvas-toolbar">
              <div className="bpm-canvas-actions">
                <button className="bpm-canvas-btn" onClick={() => fitView()}>
                  <span className="bpm-icon">🔍</span>
                  Fit View
                </button>
                <button className="bpm-canvas-btn" onClick={() => setNodes([])}>
                  <span className="bpm-icon">🗑️</span>
                  Clear
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Sidebar - Properties/Execution */}
        <div className="bpm-sidebar bpm-sidebar-right">
          {viewMode === 'design' && (
            <BPMPropertiesPanel
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onUpdateNode={updateNodeData}
              onDeleteNode={deleteNode}
            />
          )}
          {viewMode === 'monitor' && (
            <BPMExecutionPanel
              executionData={executionData}
              processData={processData}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showProcessModal && (
        <BPMProcessModal
          processData={processData}
          onUpdate={setProcessData}
          onClose={() => setShowProcessModal(false)}
        />
      )}
      
      {showTaskModal && selectedNode && (
        <BPMTaskModal
          node={selectedNode}
          onUpdate={updateNodeData}
          onClose={() => setShowTaskModal(false)}
        />
      )}
      
      {showConditionModal && selectedEdge && (
        <BPMConditionModal
          edge={selectedEdge}
          onUpdate={(edgeId, data) => {
            setEdges((eds) =>
              eds.map((edge) =>
                edge.id === edgeId ? { ...edge, data: { ...edge.data, ...data } } : edge
              )
            );
          }}
          onClose={() => setShowConditionModal(false)}
        />
      )}
    </div>
  );
};

export default BPMInterface;
