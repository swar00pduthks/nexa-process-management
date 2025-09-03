import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import './FlowBuilder.css';
import NaturalLanguageInput from './NaturalLanguageInput';
import EntityNode from './nodes/EntityNode';
import JoinNode from './nodes/JoinNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import EntityPalette from './EntityPalette';
import PropertyPanel from './PropertyPanel';
import RuleConfiguration from './RuleConfiguration';
import SideChatbot from './SideChatbot';
import ProcessFlowVisualizer from './ProcessFlowVisualizer';
import ProcessSelector from './ProcessSelector';
import SaveProcessModal from './SaveProcessModal';
import processService from '../services/processService';

const nodeTypes = {
  entityNode: EntityNode,
  joinNode: JoinNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode
};

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [generatedRule, setGeneratedRule] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showChatbot, setShowChatbot] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. I can help you build business process flows and event correlation rules. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [flowStats, setFlowStats] = useState({
    totalEntities: 0,
    totalJoins: 0,
    totalActions: 0,
    totalConditions: 0,
    totalEdges: 0
  });

  // New state for save/load functionality
  const [showProcessSelector, setShowProcessSelector] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [currentProcess, setCurrentProcess] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

  // Add drag and drop handlers
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const nodeData = event.dataTransfer.getData('application/reactflow-data');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode;
      
      if (type === 'entityNode') {
        const entityData = JSON.parse(nodeData);
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: entityData.name,
            entityType: entityData.type,
            attributes: entityData.attributes,
            icon: entityData.icon,
            dataset: entityData.dataset
          },
        };
      } else if (type === 'joinNode') {
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: 'Join Condition',
            joinType: 'inner',
            joinCondition: ''
          },
        };
      } else if (type === 'actionNode') {
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: 'Action',
            actionType: 'notification',
            actionDetails: ''
          },
        };
      }

      if (newNode) {
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

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

  // Update flow stats when nodes/edges change
  useEffect(() => {
    const stats = {
      totalEntities: nodes.filter(n => n.type === 'entityNode').length,
      totalJoins: nodes.filter(n => n.type === 'joinNode').length,
      totalActions: nodes.filter(n => n.type === 'actionNode').length,
      totalConditions: nodes.filter(n => n.type === 'conditionNode').length,
      totalEdges: edges.length
    };
    setFlowStats(stats);
  }, [nodes, edges]);

  // AI Integration - Connect to OpenAI or similar service
  const callAIService = async (message, context) => {
    try {
      // You can replace this with your preferred AI service
      // Options: OpenAI, Anthropic Claude, Azure OpenAI, etc.
      
      // For now, using a more sophisticated mock response
      // In production, replace this with actual API call:
      /*
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {
            nodes: nodes.length,
            edges: edges.length,
            flowType: 'business-process',
            currentEntities: nodes.filter(n => n.type === 'entityNode').map(n => n.data.entityType)
          }
        })
      });
      
      const data = await response.json();
      return data.response;
      */
      
      // Enhanced mock AI response
      return generateEnhancedAIResponse(message, context);
    } catch (error) {
      console.error('AI service error:', error);
      return "I'm having trouble connecting to my AI service right now. Please try again later or use the visual flow builder to create your process.";
    }
  };

  const generateEnhancedAIResponse = (message, context) => {
    const lowerMessage = message.toLowerCase();
    const { nodes, edges } = context;
    
    // More sophisticated response generation
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I can help you build business process flows! Here are some things you can do:\n\n" +
             "• Drag entities from the left panel to create data sources\n" +
             "• Add conditions to specify business rules\n" +
             "• Connect nodes to create flow logic\n" +
             "• Use the natural language input to describe your process\n\n" +
             "What type of business process are you trying to create?";
    }
    
    if (lowerMessage.includes('entity') || lowerMessage.includes('data')) {
      return "To add entities (data sources), drag them from the left panel onto the canvas. " +
             "Each entity represents a data source like customers, orders, or inventory. " +
             "You can then configure their attributes and relationships.";
    }
    
    if (lowerMessage.includes('condition') || lowerMessage.includes('rule')) {
      return "Conditions define when actions should be triggered. You can create conditions based on:\n\n" +
             "• Data field values (e.g., customer status = 'active')\n" +
             "• Time-based rules (e.g., business date = today)\n" +
             "• Cross-entity relationships (e.g., order amount > threshold)\n\n" +
             "Would you like me to help you create a specific condition?";
    }
    
    if (lowerMessage.includes('action') || lowerMessage.includes('trigger')) {
      return "Actions are what happen when conditions are met. Common actions include:\n\n" +
             "• Send notifications\n" +
             "• Trigger calculations\n" +
             "• Create alerts\n" +
             "• Update data\n" +
             "• Start workflows\n\n" +
             "What action would you like to configure?";
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('export')) {
      return "You can save your flow configuration using the 'Save Process' button. " +
             "The system will store your flow with all its nodes, connections, and configurations. " +
             "You can also export the flow as JSON for backup or sharing.";
    }
    
    if (lowerMessage.includes('example') || lowerMessage.includes('sample')) {
      return "Here's a common business process example:\n\n" +
             "1. Customer places an order (Customer Entity)\n" +
             "2. Order amount exceeds threshold (Condition)\n" +
             "3. Send notification to manager (Action)\n\n" +
             "Try clicking the 'Test Flow' button to see this example in action!";
    }
    
    // Context-aware responses
    if (nodes.length === 0) {
      return "I see you haven't added any entities yet. Start by dragging entities from the left panel onto the canvas. " +
             "This will give you the building blocks for your business process flow.";
    }
    
    if (nodes.length > 0 && edges.length === 0) {
      return "Great! You have entities on the canvas. Now try connecting them to create flow logic. " +
             "You can also add Join nodes to specify how entities should be related.";
    }
    
    return "I understand you're working on a business process flow. " +
           "I can help you with adding entities, creating conditions, setting up actions, " +
           "or explaining how to connect everything together. What specific aspect would you like help with?";
  };

  // Chatbot message handler with AI integration
  const handleChatMessage = useCallback(async (message) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Call AI service
    const aiResponse = await callAIService(message, { nodes, edges });
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: aiResponse,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, botMessage]);
  }, [nodes, edges]);

  // Test function to create a sample flow for demonstration
  const createTestFlow = () => {
    const testNodes = [
      {
        id: 'customer-entity',
        type: 'entityNode',
        position: { x: 100, y: 100 },
        data: {
          label: 'Customer',
          entityType: 'customer',
          attributes: ['customer_id', 'name', 'email', 'region'],
          selectedAttributes: ['customer_id', 'region']
        }
      },
      {
        id: 'order-entity',
        type: 'entityNode',
        position: { x: 100, y: 300 },
        data: {
          label: 'Order',
          entityType: 'order',
          attributes: ['order_id', 'customer_id', 'amount', 'status'],
          selectedAttributes: ['order_id', 'customer_id', 'amount']
        }
      },
      {
        id: 'join-condition',
        type: 'joinNode',
        position: { x: 400, y: 200 },
        data: {
          label: 'Customer-Order Join',
          joinType: 'inner',
          joinCondition: 'customer_id = customer_id'
        }
      },
      {
        id: 'business-rule',
        type: 'conditionNode',
        position: { x: 700, y: 200 },
        data: {
          label: 'High Value Order',
          condition: 'amount > 1000',
          operator: 'greater_than',
          value: '1000'
        }
      },
      {
        id: 'notification-action',
        type: 'actionNode',
        position: { x: 1000, y: 200 },
        data: {
          label: 'Send Alert',
          actionType: 'notification',
          actionDetails: 'Send high value order alert to manager'
        }
      }
    ];

    const testEdges = [
      {
        id: 'e1-2',
        source: 'customer-entity',
        target: 'join-condition',
        type: 'smoothstep'
      },
      {
        id: 'e2-3',
        source: 'order-entity',
        target: 'join-condition',
        type: 'smoothstep'
      },
      {
        id: 'e3-4',
        source: 'join-condition',
        target: 'business-rule',
        type: 'smoothstep'
      },
      {
        id: 'e4-5',
        source: 'business-rule',
        target: 'notification-action',
        type: 'smoothstep'
      }
    ];

    setNodes(testNodes);
    setEdges(testEdges);
  };

  const handleRuleGenerated = useCallback((rule) => {
    setGeneratedRule(rule);
    
    // Automatically create visual flow diagram from the generated rule
    generateFlowFromRule(rule);
    
    // Add a bot message about the generated rule
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Great! I've generated a business rule based on your description and created a visual flow diagram. The rule includes ${rule.conditions?.length || 0} conditions and ${rule.actions?.length || 0} actions. You can now refine it using the visual flow builder.`,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, botMessage]);
  }, []);

  // Function to generate visual flow from natural language rule
  const generateFlowFromRule = (rule) => {
    const newNodes = [];
    const newEdges = [];
    
    // Calculate layout dimensions for horizontal flow
    const nodeSpacing = 250;
    const startX = 100;
    const startY = 200;
    let currentX = startX;
    
    // Create entity nodes from the rule
    if (rule.entities && rule.entities.length > 0) {
      rule.entities.forEach((entity, index) => {
        const nodeId = `entity-${index}`;
        newNodes.push({
          id: nodeId,
          type: 'entityNode',
          position: { x: currentX, y: startY + (index * 150) },
          data: {
            label: entity.name || entity.type,
            entityType: entity.type,
            attributes: entity.attributes || [],
            selectedAttributes: entity.selectedAttributes || [],
            icon: getEntityIcon(entity.type)
          }
        });
        currentX += nodeSpacing;
      });
    }
    
    // Create join node if there are multiple entities
    if (rule.entities && rule.entities.length > 1) {
      const joinNodeId = 'join-node';
      newNodes.push({
        id: joinNodeId,
        type: 'joinNode',
        position: { x: currentX, y: startY + ((rule.entities.length - 1) * 75) },
        data: {
          label: 'Join Condition',
          joinType: 'inner',
          joinCondition: rule.joinConditions ? JSON.stringify(rule.joinConditions) : ''
        }
      });
      
      // Connect entities to join node
      rule.entities.forEach((entity, index) => {
        newEdges.push({
          id: `edge-entity-${index}-join`,
          source: `entity-${index}`,
          target: joinNodeId,
          type: 'smoothstep'
        });
      });
      
      currentX += nodeSpacing;
    }
    
    // Create condition nodes
    if (rule.conditions && rule.conditions.length > 0) {
      rule.conditions.forEach((condition, index) => {
        const conditionNodeId = `condition-${index}`;
        newNodes.push({
          id: conditionNodeId,
          type: 'conditionNode',
          position: { x: currentX, y: startY + (index * 120) },
          data: {
            label: condition.name || `Condition ${index + 1}`,
            condition: condition.expression || condition.field,
            operator: condition.operator || 'equals',
            value: condition.value || ''
          }
        });
        
        // Connect to previous node (join or last entity)
        const sourceNode = rule.entities && rule.entities.length > 1 ? 'join-node' : `entity-${Math.min(index, rule.entities.length - 1)}`;
        newEdges.push({
          id: `edge-${sourceNode}-condition-${index}`,
          source: sourceNode,
          target: conditionNodeId,
          type: 'smoothstep'
        });
        
        currentX += nodeSpacing;
      });
    }
    
    // Create action nodes
    if (rule.actions && rule.actions.length > 0) {
      rule.actions.forEach((action, index) => {
        const actionNodeId = `action-${index}`;
        newNodes.push({
          id: actionNodeId,
          type: 'actionNode',
          position: { x: currentX, y: startY + (index * 120) },
          data: {
            label: action.name || `Action ${index + 1}`,
            actionType: action.type || 'notification',
            actionDetails: action.description || action.details || ''
          }
        });
        
        // Connect to previous node (condition or join or entity)
        let sourceNode;
        if (rule.conditions && rule.conditions.length > 0) {
          sourceNode = `condition-${Math.min(index, rule.conditions.length - 1)}`;
        } else if (rule.entities && rule.entities.length > 1) {
          sourceNode = 'join-node';
        } else {
          sourceNode = `entity-${Math.min(index, rule.entities.length - 1)}`;
        }
        
        newEdges.push({
          id: `edge-${sourceNode}-action-${index}`,
          source: sourceNode,
          target: actionNodeId,
          type: 'smoothstep'
        });
        
        currentX += nodeSpacing;
      });
    }
    
    // If no specific entities/conditions/actions, create a basic flow
    if (newNodes.length === 0) {
      // Create a generic flow based on rule description
      newNodes.push(
        {
          id: 'input-entity',
          type: 'entityNode',
          position: { x: startX, y: startY },
          data: {
            label: 'Input Data',
            entityType: 'input',
            attributes: ['data'],
            selectedAttributes: ['data'],
            icon: '📥'
          }
        },
        {
          id: 'process-condition',
          type: 'conditionNode',
          position: { x: startX + nodeSpacing, y: startY },
          data: {
            label: 'Process Condition',
            condition: 'data',
            operator: 'not_empty',
            value: ''
          }
        },
        {
          id: 'output-action',
          type: 'actionNode',
          position: { x: startX + (nodeSpacing * 2), y: startY },
          data: {
            label: 'Output Action',
            actionType: 'notification',
            actionDetails: rule.description || 'Process completed'
          }
        }
      );
      
      newEdges.push(
        {
          id: 'edge-input-condition',
          source: 'input-entity',
          target: 'process-condition',
          type: 'smoothstep'
        },
        {
          id: 'edge-condition-action',
          source: 'process-condition',
          target: 'output-action',
          type: 'smoothstep'
        }
      );
    }
    
    // Set the new nodes and edges
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Helper function to get entity icons
  const getEntityIcon = (entityType) => {
    const iconMap = {
      customer: '👥',
      order: '📦',
      sales: '💰',
      inventory: '📦',
      system: '⚙️',
      user: '👤',
      product: '🏷️',
      transaction: '💳',
      default: '📊'
    };
    return iconMap[entityType] || iconMap.default;
  };

  return (
    <div className="flow-builder-container">
      <div className="flow-builder">
        <div className="sidebar">
          <EntityPalette />
          <div className="flow-stats">
            <h3>📊 Flow Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Entities:</span>
                <span className="stat-value">{flowStats.totalEntities}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conditions:</span>
                <span className="stat-value">{flowStats.totalConditions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Actions:</span>
                <span className="stat-value">{flowStats.totalActions}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Connections:</span>
                <span className="stat-value">{flowStats.totalEdges}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flow-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <Background />
            <MiniMap />
            <Panel position="top-right" className="flow-controls">
              <button onClick={createTestFlow} className="test-flow-btn">
                🧪 Test Flow
              </button>
              <button 
                onClick={() => setShowChatbot(!showChatbot)} 
                className="chat-toggle-btn"
              >
                {showChatbot ? '💬' : '🤖'}
              </button>
            </Panel>
          </ReactFlow>
        </div>

        <div className="right-panel">
          <NaturalLanguageInput onRuleGenerated={handleRuleGenerated} />
          <ProcessFlowVisualizer 
            naturalLanguageInput={naturalLanguageInput}
            generatedRule={generatedRule}
          />
          <div className="flow-actions">
            <button 
              onClick={() => setShowSaveModal(true)} 
              className="save-process-btn"
              disabled={nodes.length === 0}
            >
              💾 Save Process
            </button>
            <button 
              onClick={() => setShowProcessSelector(true)} 
              className="load-process-btn"
            >
              📂 Load Process
            </button>
          </div>
          <RuleConfiguration rule={generatedRule} />
        </div>
      </div>

      {showChatbot && (
        <SideChatbot 
          messages={chatMessages}
          onSendMessage={handleChatMessage}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {showPropertyPanel && selectedNode && (
        <PropertyPanel
          node={selectedNode}
          onUpdate={handleNodeUpdate}
          onClose={() => setShowPropertyPanel(false)}
        />
      )}
    </div>
  );
};

// JSON Side Panel component for FlowBuilder
const JsonSidePanel = ({ nodes, edges, generatedRule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonData = {
    flow: {
      nodes: nodes,
      edges: edges
    },
    rule: generatedRule,
    timestamp: new Date().toISOString(),
    version: "1.0"
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (nodes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">JSON Data</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-3">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No flow data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">JSON Data</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Copy JSON"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button
              onClick={downloadJson}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              title="Download JSON"
            >
              💾 Download
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-64'}`}>
        <div className="p-4 overflow-auto">
          <pre className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-3 rounded border overflow-x-auto">
            <code>{JSON.stringify(jsonData, null, 2)}</code>
          </pre>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span className="text-green-600">● Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
