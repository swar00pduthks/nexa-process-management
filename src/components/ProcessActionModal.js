import React, { useState } from 'react';
import './ProcessActionModal.css';

const ProcessActionModal = ({ processAction, generatedProcess, onSave, onCancel }) => {
  const [action, setAction] = useState(processAction || {
    eventType: 'business-process-completed',
    eventName: '',
    contextMapping: {
      businessDate: '${businessDate}',
      region: '${region}',
      processId: '${processId}'
    },
    customContext: []
  });

  const addCustomContext = () => {
    setAction({
      ...action,
      customContext: [...action.customContext, { 
        key: '', 
        source: 'phase-event', 
        sourcePhase: '', 
        sourceField: '' 
      }]
    });
  };

  const updateCustomContext = (index, field, value) => {
    const updatedContext = [...action.customContext];
    updatedContext[index] = { ...updatedContext[index], [field]: value };
    setAction({ ...action, customContext: updatedContext });
  };

  const removeCustomContext = (index) => {
    const updatedContext = action.customContext.filter((_, i) => i !== index);
    setAction({ ...action, customContext: updatedContext });
  };

  // Get all available phases for context selection
  const getAvailablePhases = () => {
    if (!generatedProcess || !generatedProcess.phases) return [];
    return generatedProcess.phases.map(phase => ({
      phaseId: phase.id,
      phaseName: phase.name
    }));
  };

  const availablePhases = getAvailablePhases();

  return (
    <div className="process-action-modal-overlay">
      <div className="process-action-modal">
        <div className="modal-header">
          <h3>⚡ Business Process Action Configuration</h3>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>
        
        <div className="modal-content">
          <div className="action-section">
            <h4>Event Configuration</h4>
            <p className="section-description">
              Configure what event to publish when all phases of "{generatedProcess?.name}" are completed:
            </p>
            
            <div className="input-group">
              <label>Event Type:</label>
              <select
                value={action.eventType}
                onChange={(e) => setAction({ ...action, eventType: e.target.value })}
              >
                <option value="business-process-completed">Business Process Completed</option>
                <option value="business-process-started">Business Process Started</option>
                <option value="business-process-failed">Business Process Failed</option>
                <option value="custom-event">Custom Event</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Event Name:</label>
              <input
                type="text"
                value={action.eventName}
                onChange={(e) => setAction({ ...action, eventName: e.target.value })}
                placeholder="e.g., daily-financial-close-completed"
              />
            </div>
          </div>

          <div className="action-section">
            <h4>Context Mapping</h4>
            <p className="section-description">
              Select context attributes from phase events, process context, or specify custom values:
            </p>
            
            <div className="context-mapping">
              <div className="input-group">
                <label>Business Date:</label>
                <select
                  value={action.contextMapping.businessDate}
                  onChange={(e) => setAction({
                    ...action,
                    contextMapping: { ...action.contextMapping, businessDate: e.target.value }
                  })}
                >
                  <option value="${businessDate}">From Process Context</option>
                  <option value="phase-event">From Phase Event</option>
                  <option value="custom">Custom Value</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Region:</label>
                <select
                  value={action.contextMapping.region}
                  onChange={(e) => setAction({
                    ...action,
                    contextMapping: { ...action.contextMapping, region: e.target.value }
                  })}
                >
                  <option value="${region}">From Process Context</option>
                  <option value="phase-event">From Phase Event</option>
                  <option value="custom">Custom Value</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Process ID:</label>
                <select
                  value={action.contextMapping.processId}
                  onChange={(e) => setAction({
                    ...action,
                    contextMapping: { ...action.contextMapping, processId: e.target.value }
                  })}
                >
                  <option value="${processId}">Current Process ID</option>
                  <option value="phase-event">From Phase Event</option>
                  <option value="custom">Custom Value</option>
                </select>
              </div>
            </div>
          </div>

          <div className="action-section">
            <h4>Custom Context Attributes</h4>
            <p className="section-description">
              Add custom context attributes from specific phase events:
            </p>
            
            <div className="custom-context">
              {action.customContext && action.customContext.map((context, index) => (
                <div key={index} className="context-mapping-row">
                  <div className="input-group">
                    <label>Context Key:</label>
                    <input
                      type="text"
                      value={context.key}
                      onChange={(e) => updateCustomContext(index, 'key', e.target.value)}
                      placeholder="e.g., totalRevenue, customerCount"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Source:</label>
                    <select
                      value={context.source}
                      onChange={(e) => updateCustomContext(index, 'source', e.target.value)}
                    >
                      <option value="phase-event">Phase Event</option>
                      <option value="process-context">Process Context</option>
                      <option value="custom">Custom Value</option>
                    </select>
                  </div>
                  
                  {context.source === 'phase-event' && (
                    <div className="input-group">
                      <label>Source Phase:</label>
                      <select
                        value={context.sourcePhase}
                        onChange={(e) => updateCustomContext(index, 'sourcePhase', e.target.value)}
                      >
                        <option value="">Select phase</option>
                        {availablePhases && availablePhases.map(phase => (
                          <option key={phase.phaseId} value={phase.phaseId}>
                            {phase.phaseName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="input-group">
                    <label>Source Field:</label>
                    <input
                      type="text"
                      value={context.sourceField}
                      onChange={(e) => updateCustomContext(index, 'sourceField', e.target.value)}
                      placeholder="e.g., context.totalRevenue, data.customerCount"
                    />
                  </div>
                  
                  <button
                    onClick={() => removeCustomContext(index)}
                    className="remove-condition-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button onClick={addCustomContext} className="add-condition-btn">
                + Add Custom Context
              </button>
            </div>
          </div>

          <div className="action-section">
            <h4>Process Summary</h4>
            <p className="section-description">
              This action will trigger when all {generatedProcess?.phases?.length || 0} phases are completed:
            </p>
            <div className="phases-summary">
              {generatedProcess?.phases?.map((phase, index) => (
                <div key={phase.id} className="phase-summary-item">
                  <span className="phase-number">{index + 1}</span>
                  <span className="phase-name">{phase.name}</span>
                  <span className="phase-calculators">
                    ({phase.calculators?.length || 0} calculators)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button onClick={() => onSave(action)} className="save-btn">
            Save Process Action
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessActionModal;
