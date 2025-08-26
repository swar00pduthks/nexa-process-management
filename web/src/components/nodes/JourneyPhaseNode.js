import React from 'react';
import { Handle } from 'reactflow';

const JourneyPhaseNode = ({ data }) => {
  const { phase, isCurrentPhase, isStuckPhase, onClick } = data;
  
  const getStatusColor = () => {
    if (isStuckPhase) return '#ef4444';
    if (phase.status === 'completed') return '#10b981';
    if (phase.status === 'in-progress') return '#3b82f6';
    if (phase.status === 'failed') return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = () => {
    if (isStuckPhase) return '⚠️';
    if (phase.status === 'completed') return '✅';
    if (phase.status === 'in-progress') return '🔄';
    if (phase.status === 'failed') return '❌';
    return '⏳';
  };

  const getNodeClass = () => {
    let baseClass = 'journey-phase-node';
    if (isStuckPhase) return `${baseClass} stuck`;
    return `${baseClass} ${phase.status}`;
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={getNodeClass()} onClick={handleClick}>
      <Handle type="target" position="left" />
      
      <div className="node-content">
        <div className="phase-header">
          <div className="phase-marker" style={{ backgroundColor: getStatusColor() }}>
            <span className="status-icon">{getStatusIcon()}</span>
          </div>
          <div className="phase-info">
            <div className="phase-name">{phase.name}</div>
            <div className="phase-status" style={{ color: getStatusColor() }}>
              {phase.status}
            </div>
          </div>
        </div>
        
        {phase.progress !== undefined && (
          <div className="phase-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${phase.progress}%`,
                  backgroundColor: getStatusColor()
                }}
              ></div>
            </div>
            <span className="progress-text">{phase.progress}%</span>
          </div>
        )}
        
        <div className="phase-meta">
          <div className="meta-item">
            <span className="meta-label">Mode:</span>
            <span className="meta-value">{phase.transportMode}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">App:</span>
            <span className="meta-value">{phase.application}</span>
          </div>
        </div>
        
        <div className="click-hint">
          Click to view calculators
        </div>
      </div>

      <Handle type="source" position="right" />
    </div>
  );
};

export default JourneyPhaseNode;
