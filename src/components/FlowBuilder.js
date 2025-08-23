import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import './FlowBuilder.css';
import NaturalLanguageInput from './NaturalLanguageInput';
import EntityNode from './nodes/EntityNode';
import JoinNode from './nodes/JoinNode';
import ActionNode from './nodes/ActionNode';
import EntityPalette from './EntityPalette';
import PropertyPanel from './PropertyPanel';
import RuleConfiguration from './RuleConfiguration';

const nodeTypes = {
  entityNode: EntityNode,
  joinNode: JoinNode,
  actionNode: ActionNode
};

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [generatedRule, setGeneratedRule] = useState(null);

  const onConnect = useCallback(
    (params) => {
      // Only allow connections from entities to join nodes, and join nodes to action nodes
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (sourceNode && targetNode) {
        if (sourceNode.type === 'entityNode' && targetNode.type === 'joinNode') {
          setEdges((eds) => addEdge(params, eds));
        } else if (sourceNode.type === 'joinNode' && targetNode.type === 'actionNode') {
          setEdges((eds) => addEdge(params, eds));
        }
      }
    },
    [setEdges, nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const data = JSON.parse(event.dataTransfer.getData('application/reactflow-data') || '{}');
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode;
      
      if (type === 'entityNode') {
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: data.name,
            entityType: data.type,
            attributes: data.attributes || [],
            selectedAttributes: [],
            ...data
          },
        };
      } else if (type === 'joinNode') {
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: 'Join Condition',
            joinConditions: [],
            contextMapping: {},
            customAttributes: {}
          },
        };
      } else if (type === 'actionNode') {
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: 'Action',
            taskName: '',
            triggerEvent: '',
            contextMapping: {}
          },
        };
      }

      if (newNode) {
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowPropertyPanel(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowPropertyPanel(false);
  }, []);

  const handleNodeUpdate = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleRuleGenerated = (rule) => {
    setGeneratedRule(rule);
    // Generate flow from natural language rule
    generateFlowFromRule(rule);
  };

  const generateFlowFromRule = (rule) => {
    const newNodes = [];
    const newEdges = [];

    // Parse the rule and create nodes
    if (rule.entities) {
      rule.entities.forEach((entity, index) => {
        newNodes.push({
          id: `entity-${index}`,
          type: 'entityNode',
          position: { x: 100 + index * 200, y: 100 },
          data: {
            label: entity.name,
            entityType: entity.type,
            attributes: entity.attributes || [],
            selectedAttributes: entity.selectedAttributes || []
          }
        });
      });
    }

    if (rule.joinConditions) {
      newNodes.push({
        id: 'join',
        type: 'joinNode',
        position: { x: 400, y: 200 },
        data: {
          label: 'Join Condition',
          joinConditions: rule.joinConditions,
          contextMapping: rule.contextMapping || {}
        }
      });
    }

    if (rule.action) {
      newNodes.push({
        id: 'action',
        type: 'actionNode',
        position: { x: 600, y: 200 },
        data: {
          label: rule.action.taskName || 'Action',
          taskName: rule.action.taskName,
          triggerEvent: rule.action.triggerEvent
        }
      });
    }

    // Create edges
    newNodes.forEach((node, index) => {
      if (node.type === 'entityNode') {
        newEdges.push({
          id: `edge-entity-${index}`,
          source: node.id,
          target: 'join',
          type: 'smoothstep'
        });
      } else if (node.type === 'joinNode') {
        newEdges.push({
          id: 'edge-join-action',
          source: node.id,
          target: 'action',
          type: 'smoothstep'
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const generateConfiguration = useCallback(() => {
    const entityNodes = nodes.filter(n => n.type === 'entityNode');
    const joinNode = nodes.find(n => n.type === 'joinNode');
    const actionNode = nodes.find(n => n.type === 'actionNode');

    if (!entityNodes.length || !joinNode || !actionNode) {
      return null;
    }

    const configuration = {
      rule: {
        name: "Generated Business Rule",
        entities: entityNodes.map(node => ({
          name: node.data.label,
          type: node.data.entityType,
          dataset: node.data.dataset,
          attributes: node.data.selectedAttributes
        })),
        join_conditions: joinNode.data.joinConditions,
        context_mapping: joinNode.data.contextMapping,
        custom_attributes: joinNode.data.customAttributes,
        action: {
          task: actionNode.data.taskName,
          trigger_event: actionNode.data.triggerEvent,
          context_mapping: actionNode.data.contextMapping
        }
      }
    };

    setGeneratedRule(configuration);
    return configuration;
  }, [nodes]);

  return (
    <div className="flow-builder">
      <div className="sidebar">
        <EntityPalette />
        <RuleConfiguration rule={generatedRule} />
      </div>
      
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={onInit}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          connectionMode="loose"
        >
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>

      {showPropertyPanel && selectedNode && (
        <PropertyPanel 
          node={selectedNode}
          onUpdate={handleNodeUpdate}
          onClose={() => setShowPropertyPanel(false)}
        />
      )}

      <div className="toolbar">
        <button 
          className="generate-config-btn"
          onClick={generateConfiguration}
          disabled={nodes.length < 3} // Need at least 2 entities + 1 join + 1 action
        >
          Generate Configuration
        </button>
      </div>
    </div>
  );
};

export default FlowBuilder;
