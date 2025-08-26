import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Controls,
  MiniMap,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ProcessBuilder from './ProcessBuilder';
import PhaseNode from './nodes/PhaseNode';
import ActionNode from './nodes/ActionNode';
import CalculatorNode from './nodes/CalculatorNode';
import './ProcessOrchestrator.css';
import ProcessActionModal from './ProcessActionModal';

const nodeTypes = {
  phaseNode: PhaseNode,
  actionNode: ActionNode,
  calculatorNode: CalculatorNode
};

const ProcessOrchestrator = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showProcessBuilder, setShowProcessBuilder] = useState(false);
  const [generatedProcess, setGeneratedProcess] = useState(null);
  const [showProcessActionModal, setShowProcessActionModal] = useState(false);
  const [showPhaseTasksModal, setShowPhaseTasksModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processStats, setProcessStats] = useState({
    totalPhases: 0,
    totalSubPhases: 0,
    totalCalculators: 0,
    totalEdges: 0,
    maxDepth: 0
  });
  const [processAction, setProcessAction] = useState({
    eventType: 'business-process-completed',
    eventName: '',
    contextMapping: {
      businessDate: '${businessDate}',
      region: '${region}',
      processId: '${processId}'
    },
    customContext: []
  });

  // Debug effect to monitor nodes and edges changes
  useEffect(() => {
    console.log('Nodes changed:', nodes.length, nodes);
  }, [nodes]);

  useEffect(() => {
    console.log('Edges changed:', edges.length, edges);
  }, [edges]);

  useEffect(() => {
    console.log('Generated process changed:', generatedProcess);
  }, [generatedProcess]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Helper function to calculate process statistics
  const calculateProcessStats = (process) => {
    let totalSubPhases = 0;
    let totalCalculators = 0;
    let maxDepth = 0;

    const calculatePhaseStats = (phase, depth = 0) => {
      maxDepth = Math.max(maxDepth, depth);
      
      if (phase.subPhases && phase.subPhases.length > 0) {
        totalSubPhases += phase.subPhases.length;
        phase.subPhases.forEach(subPhase => {
          calculatePhaseStats(subPhase, depth + 1);
        });
      }
      
      if (phase.calculators && phase.calculators.length > 0) {
        totalCalculators += phase.calculators.length;
      }
    };

    process.phases.forEach(phase => {
      calculatePhaseStats(phase);
    });

    return {
      totalPhases: process.phases.length,
      totalSubPhases,
      totalCalculators,
      totalEdges: 0, // Will be calculated after edge generation
      maxDepth
    };
  };

  const handleProcessGenerated = (process) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Process generated:', process);
      console.log('Phases count:', process.phases?.length || 0);
      console.log('Process action:', processAction);
      
      // Calculate statistics
      const stats = calculateProcessStats(process);
      console.log('Process statistics:', stats);
      
      setGeneratedProcess(process);
      setShowProcessBuilder(false);
      
      // Generate React Flow nodes from the process - Elizabeth Line Style Layout
      const flowNodes = [];
      const flowEdges = [];
      
      // Calculate layout dimensions for horizontal Elizabeth Line style
      const phasesCount = process.phases.length;
      const stationSpacing = 200; // Horizontal spacing between stations (further reduced)
      const trackSpacing = 100; // Vertical spacing between parallel tracks (further reduced)
      const startX = 50;
      const startY = 100;
      
      console.log('Layout dimensions:', {
        phasesCount,
        stationSpacing,
        trackSpacing,
        startX,
        startY
      });
      
      // Recursive function to process phases and their nested sub-phases
      const processPhaseHierarchy = (phase, phaseIndex, level = 0, parentX = null, parentY = null) => {
        const stationX = parentX || (startX + (phaseIndex * stationSpacing));
        const stationY = parentY || (startY + (level * trackSpacing));
        
        console.log(`Processing phase: ${phase.name} at position (${stationX}, ${stationY}), level: ${level}`);
        
        // Add phase node (station)
        const phaseNodeId = `phase-${phase.id}`;
        const phaseNode = {
          id: phaseNodeId,
          type: 'phaseNode',
          position: { x: stationX, y: stationY },
          data: { 
            phase: phase,
            calculators: phase.calculators,
            subPhases: phase.subPhases,
            trackNumber: phaseIndex + 1,
            level: level,
            isJunction: true,
            stationName: phase.name,
            onClick: () => {
              console.log('Phase clicked:', phase.name);
              setSelectedPhase(phase);
              setShowPhaseTasksModal(true);
            }
          }
        };
        
        console.log('Created phase node:', phaseNode);
        flowNodes.push(phaseNode);
        
        // Process sub-phases if they exist (branch lines)
        if (phase.subPhases && phase.subPhases.length > 0) {
          console.log(`Phase ${phase.name} has ${phase.subPhases.length} sub-phases`);
          const branchSpacing = trackSpacing / (phase.subPhases.length + 1);
          
          phase.subPhases.forEach((subPhase, subIndex) => {
            const branchY = stationY + ((subIndex + 1) * branchSpacing);
            
            console.log(`Processing sub-phase: ${subPhase.name} at branch Y: ${branchY}`);
            
            // Recursively process sub-phase
            const subPhaseNodeId = processPhaseHierarchy(
              subPhase, 
              subIndex, 
              level + 1, 
              stationX + stationSpacing,
              branchY
            );
            
            // Connect parent station to branch station
            flowEdges.push({
              id: `edge-${phaseNodeId}-to-${subPhaseNodeId}`,
              source: phaseNodeId,
              target: subPhaseNodeId,
              type: 'smoothstep',
              style: { 
                stroke: '#111827', 
                strokeWidth: 3
              }
            });
          });
        }
        
        // Don't add calculator nodes to the graph - they'll be shown in popup when phase is clicked
        
        return phaseNodeId;
      };
      
      // Process all top-level phases (main line stations)
      const finalStationIds = [];
      process.phases.forEach((phase, phaseIndex) => {
        const finalId = processPhaseHierarchy(phase, phaseIndex);
        finalStationIds.push(finalId);
      });
      
      // Add destination node (Terminal Station) - all lines converge here
      const maxLevel = Math.max(...process.phases.map(p => getMaxLevel(p)));
      const destinationX = startX + ((phasesCount + 1) * stationSpacing);
      const destinationY = startY + (Math.floor(phasesCount / 2) * trackSpacing);
      
      console.log('Destination node position:', { destinationX, destinationY, maxLevel });
      
      if (processAction && processAction.eventType) {
        const actionNode = {
          id: 'process-action',
          type: 'actionNode',
          position: { x: destinationX, y: destinationY },
          data: { 
            action: processAction,
            isDestination: true,
            stationName: 'Final Destination'
          }
        };
        
        console.log('Created action node:', actionNode);
        flowNodes.push(actionNode);
        
        // Connect all final stations to destination (like Elizabeth Line converging)
        finalStationIds.forEach((stationId, index) => {
          flowEdges.push({
            id: `edge-${stationId}-to-destination`,
            source: stationId,
            target: 'process-action',
            type: 'smoothstep',
            style: { 
              stroke: '#111827', 
              strokeWidth: 3
            }
          });
        });
      }
      
      // Update statistics with edge count
      const finalStats = {
        ...stats,
        totalEdges: flowEdges.length
      };
      setProcessStats(finalStats);
      
      console.log('Generated flow nodes:', flowNodes.length);
      console.log('Generated flow edges:', flowEdges.length);
      console.log('Final statistics:', finalStats);
      console.log('Node details:', flowNodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: { label: node.data.stationName || node.data.phase?.name }
      })));
      console.log('Edge details:', flowEdges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      })));
      
      console.log('Setting nodes and edges...');
      setNodes(flowNodes);
      setEdges(flowEdges);
      
    } catch (err) {
      console.error('Error generating process:', err);
      setError('Failed to generate process: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get maximum level in a phase hierarchy
  const getMaxLevel = (phase, currentLevel = 0) => {
    let maxLevel = currentLevel;
    
    if (phase.subPhases && phase.subPhases.length > 0) {
      phase.subPhases.forEach(subPhase => {
        const subLevel = getMaxLevel(subPhase, currentLevel + 1);
        maxLevel = Math.max(maxLevel, subLevel);
      });
    } else if (phase.calculators && phase.calculators.length > 0) {
      maxLevel = currentLevel + phase.calculators.length;
    }
    
    return maxLevel;
  };

  const openProcessActionModal = () => {
    setShowProcessActionModal(true);
  };

  const updateProcessAction = (action) => {
    setProcessAction(action);
    setShowProcessActionModal(false);
    
    // Regenerate the entire flow with updated action
    if (generatedProcess) {
      handleProcessGenerated(generatedProcess);
    }
  };

  // Test function to create a sample process for debugging
  const createTestProcess = () => {
    const testProcess = {
      id: 'test-process-1',
      name: 'Customer Data Pipeline',
      description: 'End-to-end customer data processing pipeline',
      phases: [
        {
          id: 'phase-1',
          name: 'Data Ingestion',
          description: 'Ingest customer data from multiple sources',
          calculators: [
            {
              id: 'calc-1',
              name: 'Load Customer Data',
              application: 'ETL Tool'
            },
            {
              id: 'calc-2',
              name: 'Validate Data Quality',
              application: 'Data Quality'
            }
          ],
          subPhases: [
            {
              id: 'subphase-1-1',
              name: 'Batch Processing',
              description: 'Process historical data',
              calculators: [
                {
                  id: 'calc-1-1',
                  name: 'Historical Load',
                  application: 'Batch ETL'
                }
              ],
              subPhases: []
            },
            {
              id: 'subphase-1-2',
              name: 'Real-time Processing',
              description: 'Process streaming data',
              calculators: [
                {
                  id: 'calc-1-2',
                  name: 'Stream Processing',
                  application: 'Kafka Streams'
                }
              ],
              subPhases: []
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Data Transformation',
          description: 'Transform and enrich customer data',
          calculators: [
            {
              id: 'calc-3',
              name: 'Data Cleansing',
              application: 'Data Wrangler'
            },
            {
              id: 'calc-4',
              name: 'Feature Engineering',
              application: 'ML Pipeline'
            },
            {
              id: 'calc-5',
              name: 'Data Enrichment',
              application: 'External APIs'
            }
          ],
          subPhases: []
        },
        {
          id: 'phase-3',
          name: 'Data Storage',
          description: 'Store processed data in data warehouse',
          calculators: [
            {
              id: 'calc-6',
              name: 'Load to Data Warehouse',
              application: 'Snowflake'
            },
            {
              id: 'calc-7',
              name: 'Create Data Marts',
              application: 'Data Modeling'
            }
          ],
          subPhases: []
        }
      ]
    };
    
    console.log('Creating comprehensive test process:', testProcess);
    handleProcessGenerated(testProcess);
  };

  // Simple test function to create basic nodes
  const createSimpleTest = () => {
    console.log('Creating simple test nodes...');
    
    const simpleNodes = [
      {
        id: '1',
        type: 'phaseNode',
        position: { x: 100, y: 100 },
        data: { 
          phase: { name: 'Test Phase 1' },
          stationName: 'Test Phase 1'
        }
      },
      {
        id: '2',
        type: 'phaseNode',
        position: { x: 300, y: 100 },
        data: { 
          phase: { name: 'Test Phase 2' },
          stationName: 'Test Phase 2'
        }
      }
    ];
    
    const simpleEdges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'smoothstep'
      }
    ];
    
    console.log('Setting simple nodes:', simpleNodes);
    console.log('Setting simple edges:', simpleEdges);
    
    setNodes(simpleNodes);
    setEdges(simpleEdges);
    setGeneratedProcess({ name: 'Simple Test' });
  };

  // Reset function to clear current process
  const resetProcess = () => {
    setGeneratedProcess(null);
    setNodes([]);
    setEdges([]);
    setProcessStats({
      totalPhases: 0,
      totalSubPhases: 0,
      totalCalculators: 0,
      totalEdges: 0,
      maxDepth: 0
    });
    setError(null);
  };

  return (
    <div className="process-orchestrator">
      <div className="orchestrator-header">
        <h2>🏗️ Business Process Orchestration</h2>
        <div className="header-actions">
          {generatedProcess && (
            <>
              <button 
                onClick={openProcessActionModal}
                className="process-action-btn"
              >
                ⚡ Process Action
              </button>
              <button 
                onClick={resetProcess}
                className="create-process-btn"
                style={{ backgroundColor: '#6b7280', marginRight: '10px' }}
              >
                🔄 Reset
              </button>
            </>
          )}
          <button 
            onClick={createTestProcess}
            className="create-process-btn"
            style={{ backgroundColor: '#10b981', marginRight: '10px' }}
          >
            🧪 Test Process
          </button>
          <button 
            onClick={createSimpleTest}
            className="create-process-btn"
            style={{ backgroundColor: '#f59e0b', marginRight: '10px' }}
          >
            🔧 Simple Test
          </button>
          <button 
            onClick={() => setShowProcessBuilder(true)}
            className="create-process-btn"
          >
            + Create New Process
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 dark:border-gray-300"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Generating process...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 m-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {!generatedProcess ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 text-gray-400 mx-auto mb-6">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Process Orchestration</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Create and visualize your business processes with our intuitive orchestration tool. 
              Design complex workflows, monitor execution, and track dependencies across your data ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🧪</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Start</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Try our sample process to see how orchestration works
                </p>
                <button 
                  onClick={createTestProcess}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Create Sample Process
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Process</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Build your own process from scratch with our builder
                </p>
                <button 
                  onClick={() => setShowProcessBuilder(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Start Building
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What you can do:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Design multi-phase business processes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Connect data sources and transformations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-600 dark:text-gray-400">Monitor execution and track dependencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <StatisticsPanel processStats={processStats} generatedProcess={generatedProcess} />
          </div>
          
          {/* Graph */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <div className="h-[700px] w-full relative">
                {nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No nodes to display</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Nodes: {nodes.length}, Edges: {edges.length}
                      </p>
                      <button 
                        onClick={() => {
                          console.log('Current nodes:', nodes);
                          console.log('Current edges:', edges);
                          console.log('Generated process:', generatedProcess);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Debug Info
                      </button>
                    </div>
                  </div>
                ) : (
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.05, includeHiddenNodes: false }}
                    minZoom={0.8}
                    maxZoom={1.5}
                    defaultZoom={1}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Controls />
                    <MiniMap 
                      nodeColor={() => '#111827'} // Consistent with lineage design
                    />
                    <Background variant="dots" gap={12} size={1} />
                  </ReactFlow>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showProcessBuilder && (
        <div className="process-builder-modal-overlay">
          <div className="process-builder-modal">
            <div className="modal-header">
              <h3>🏗️ Process Builder</h3>
              <button 
                onClick={() => setShowProcessBuilder(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <ProcessBuilder onProcessGenerated={handleProcessGenerated} />
            </div>
          </div>
        </div>
      )}

      {showProcessActionModal && (
        <ProcessActionModal
          processAction={processAction}
          generatedProcess={generatedProcess}
          onSave={updateProcessAction}
          onCancel={() => setShowProcessActionModal(false)}
        />
      )}

      {showPhaseTasksModal && selectedPhase && (
        <PhaseTasksModal
          phase={selectedPhase}
          onClose={() => {
            setShowPhaseTasksModal(false);
            setSelectedPhase(null);
          }}
        />
      )}
    </div>
  );
};

// Phase Tasks Modal Component
const PhaseTasksModal = ({ phase, onClose }) => {
  const [gridApi, setGridApi] = useState(null);

  // Mock data for tasks - in real app this would come from backend
  const tasksData = phase.calculators?.map((calculator, index) => ({
    id: index + 1,
    name: calculator.name,
    application: calculator.application || 'Unknown',
    status: ['Running', 'Completed', 'Failed', 'Pending'][Math.floor(Math.random() * 4)],
    startTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    endTime: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
    duration: Math.floor(Math.random() * 3600) + 's',
    businessDate: '2024-01-15',
    region: 'APAC'
  })) || [];

  const columnDefs = [
    { field: 'name', headerName: 'Task Name', sortable: true, filter: true, width: 200 },
    { field: 'application', headerName: 'Application', sortable: true, filter: true, width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      sortable: true, 
      filter: true, 
      width: 120,
      cellRenderer: (params) => {
        const status = params.value;
        const statusClass = {
          'Running': 'status-running',
          'Completed': 'status-completed',
          'Failed': 'status-failed',
          'Pending': 'status-pending'
        }[status] || 'status-pending';
        
        return `<span class="status-badge ${statusClass}">${status}</span>`;
      }
    },
    { field: 'startTime', headerName: 'Start Time', sortable: true, filter: true, width: 180 },
    { field: 'endTime', headerName: 'End Time', sortable: true, filter: true, width: 180 },
    { field: 'duration', headerName: 'Duration', sortable: true, filter: true, width: 100 },
    { field: 'businessDate', headerName: 'Business Date', sortable: true, filter: true, width: 140 },
    { field: 'region', headerName: 'Region', sortable: true, filter: true, width: 100 }
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div className="phase-tasks-modal-overlay">
      <div className="phase-tasks-modal">
        <div className="modal-header">
          <h3>📋 {phase.name} - Tasks & Calculators</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-content">
          <div className="phase-info">
            <p><strong>Description:</strong> {phase.description}</p>
            <p><strong>Total Tasks:</strong> {tasksData.length}</p>
          </div>
          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={tasksData}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              domLayout="autoHeight"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics component
const StatisticsPanel = ({ processStats, generatedProcess }) => {
  if (!generatedProcess) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Process Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Phases:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{processStats.totalPhases}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sub-Phases:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{processStats.totalSubPhases}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{processStats.totalCalculators}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Connections:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{processStats.totalEdges}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Max Depth:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{processStats.maxDepth}</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessOrchestrator;
