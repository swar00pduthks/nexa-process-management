import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import JourneyPhaseNode from './nodes/JourneyPhaseNode';
import './ProcessJourneyViewer.css';

const nodeTypes = {
  journeyPhaseNode: JourneyPhaseNode,
};

const ProcessJourneyViewer = ({ processRun, onBack }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showCalculatorPopup, setShowCalculatorPopup] = useState(false);

  // Mock journey data for demonstration
  const journeyData = useMemo(() => ({
    journeyId: processRun?.id || 'JOURNEY-001',
    context: {
      region: processRun?.context?.region || 'APAC',
      businessDate: processRun?.context?.businessDate || '2024-01-15',
      runId: processRun?.id || 'RUN-001'
    },
    status: processRun?.status || 'in-progress',
    currentPhase: processRun?.currentPhase || 'data-ingestion',
    stuckPhase: processRun?.stuckPhase || null,
    phases: [
      {
        id: 'data-ingestion',
        name: 'Data Ingestion',
        status: 'completed',
        progress: 100,
        transportMode: 'Underground',
        application: 'Data Platform',
        calculators: [
          { id: 'customer-ingestion', name: 'Customer Ingestion', status: 'completed', timing: '09:00-09:15', progress: 100 },
          { id: 'sales-ingestion', name: 'Sales Ingestion', status: 'completed', timing: '09:15-09:30', progress: 100 },
          { id: 'inventory-ingestion', name: 'Inventory Ingestion', status: 'completed', timing: '09:30-09:45', progress: 100 }
        ]
      },
      {
        id: 'data-processing',
        name: 'Data Processing',
        status: 'in-progress',
        progress: 60,
        transportMode: 'Elizabeth Line',
        application: 'Analytics Engine',
        calculators: [
          { id: 'profit-calculator', name: 'Profit Calculator', status: 'in-progress', timing: '10:00-10:30', progress: 75 },
          { id: 'loss-calculator', name: 'Loss Calculator', status: 'pending', timing: '10:30-11:00', progress: 0 }
        ]
      },
      {
        id: 'reporting',
        name: 'Reporting',
        status: 'pending',
        progress: 0,
        transportMode: 'Overground',
        application: 'Reporting System',
        calculators: [
          { id: 'p&l-report', name: 'P&L Report', status: 'pending', timing: '11:00-11:30', progress: 0 }
        ]
      }
    ]
  }), [processRun]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate flow from journey data - only phase nodes
  useMemo(() => {
    const newNodes = [];
    const newEdges = [];
    
    let xPos = 50;
    const xSpacing = 250; // Reduced spacing between phases

    journeyData.phases.forEach((phase, phaseIndex) => {
      // Phase node only
      const phaseNode = {
        id: `phase-${phase.id}`,
        type: 'journeyPhaseNode',
        position: { x: xPos, y: 50 }, // Reduced Y position
        data: {
          phase,
          journeyContext: journeyData.context,
          isCurrentPhase: phase.id === journeyData.currentPhase,
          isStuckPhase: phase.id === journeyData.stuckPhase,
          onClick: () => handlePhaseClick(phase)
        }
      };
      newNodes.push(phaseNode);

      // Edge to next phase
      if (phaseIndex < journeyData.phases.length - 1) {
        newEdges.push({
          id: `edge-${phase.id}-next`,
          source: `phase-${phase.id}`,
          target: `phase-${journeyData.phases[phaseIndex + 1].id}`,
          type: 'smoothstep',
          style: { stroke: '#10b981', strokeWidth: 3 }
        });
      }

      xPos += xSpacing;
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [journeyData, setNodes, setEdges]);

  const handlePhaseClick = (phase) => {
    setSelectedPhase(phase);
    setShowCalculatorPopup(true);
  };

  const closeCalculatorPopup = () => {
    setShowCalculatorPopup(false);
    setSelectedPhase(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'failed': return '#ef4444';
      case 'stuck': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'failed': return '❌';
      case 'stuck': return '⚠️';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="journey-viewer">
      {/* Header - Matching Nexa Lineage Design */}
      <header className="journey-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="header-center">
          <h1 className="journey-title">Journey: {journeyData.journeyId}</h1>
          <div className="journey-context">
            <span className="context-badge">
              🌍 {journeyData.context.region}
            </span>
            <span className="context-badge">
              📅 {journeyData.context.businessDate}
            </span>
            <span className="context-badge">
              🆔 ID {journeyData.context.runId}
            </span>
            <span className="context-badge status-badge" style={{ color: getStatusColor(journeyData.status) }}>
              {getStatusIcon(journeyData.status)} {journeyData.status}
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button className="action-button">👤</button>
            <button className="action-button">⚙️</button>
            <span className="status-indicator" style={{ color: getStatusColor(journeyData.status) }}>
              {getStatusIcon(journeyData.status)} {journeyData.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Flow Area */}
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.5}
          maxZoom={1.5}
          defaultZoom={1}
          attributionPosition="bottom-left"
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          panOnDrag={true}
        >
          <Background color="#f3f4f6" gap={20} />
          <Controls 
            showZoom={false}
            showFitView={true}
            showInteractive={false}
            position="bottom-left"
          />
        </ReactFlow>
      </div>

      {/* Calculator Popup */}
      {showCalculatorPopup && selectedPhase && (
        <div className="calculator-popup-overlay" onClick={closeCalculatorPopup}>
          <div className="calculator-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>{selectedPhase.name} - Calculators</h2>
              <button className="close-button" onClick={closeCalculatorPopup}>
                ×
              </button>
            </div>
            
            <div className="popup-content">
              <div className="phase-info">
                <div className="phase-meta">
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span style={{ color: getStatusColor(selectedPhase.status) }}>
                      {getStatusIcon(selectedPhase.status)} {selectedPhase.status}
                    </span>
                  </span>
                  <span className="meta-item">
                    <strong>Progress:</strong> {selectedPhase.progress}%
                  </span>
                  <span className="meta-item">
                    <strong>Mode:</strong> {selectedPhase.transportMode}
                  </span>
                  <span className="meta-item">
                    <strong>Application:</strong> {selectedPhase.application}
                  </span>
                </div>
              </div>
              
              <div className="calculators-grid">
                {selectedPhase.calculators.map((calculator) => (
                  <div key={calculator.id} className="calculator-card">
                    <div className="calculator-header">
                      <div className="calculator-name">{calculator.name}</div>
                      <div className="calculator-status" style={{ color: getStatusColor(calculator.status) }}>
                        {getStatusIcon(calculator.status)} {calculator.status}
                      </div>
                    </div>
                    
                    <div className="calculator-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${calculator.progress}%`,
                            backgroundColor: getStatusColor(calculator.status)
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{calculator.progress}%</span>
                    </div>
                    
                    <div className="calculator-timing">
                      <span className="timing-label">Timing:</span>
                      <span className="timing-value">{calculator.timing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessJourneyViewer;
