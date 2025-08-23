import React, { useState } from 'react';
import './ProcessBuilder.css';

const ProcessBuilder = ({ onProcessGenerated }) => {
  const [processName, setProcessName] = useState('');
  const [processDescription, setProcessDescription] = useState('');
  const [phases, setPhases] = useState([]);
  const [calculators, setCalculators] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showCorrelationModal, setShowCorrelationModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const availableCalculators = [
    { 
      name: 'P&L Calculator', 
      application: 'Finance', 
      description: 'Profit and Loss calculations',
      taskName: 'pl-calculator',
      events: ['task-started', 'task-completed', 'task-failed']
    },
    { 
      name: 'Customer Retention', 
      application: 'CRM', 
      description: 'Customer retention analysis',
      taskName: 'customer-retention',
      events: ['task-started', 'task-completed', 'task-failed']
    },
    { 
      name: 'Inventory Reorder', 
      application: 'Inventory', 
      description: 'Automatic reorder calculations',
      taskName: 'inventory-reorder',
      events: ['task-started', 'task-completed', 'task-failed']
    },
    { 
      name: 'Sales Forecast', 
      application: 'Sales', 
      description: 'Sales forecasting model',
      taskName: 'sales-forecast',
      events: ['task-started', 'task-completed', 'task-failed']
    },
    { 
      name: 'Risk Assessment', 
      application: 'Finance', 
      description: 'Risk evaluation calculator',
      taskName: 'risk-assessment',
      events: ['task-started', 'task-completed', 'task-failed']
    },
    { 
      name: 'Performance Metrics', 
      application: 'Analytics', 
      description: 'Performance measurement',
      taskName: 'performance-metrics',
      events: ['task-started', 'task-completed', 'task-failed']
    }
  ];

  const addPhase = () => {
    const newPhase = {
      id: Date.now(),
      name: `Phase ${phases.length + 1}`,
      description: '',
      calculators: [],
      correlationConditions: {
        requiredEvents: ['task-completed'],
        contextConditions: [
          { field: 'businessDate', operator: 'equals', value: '${businessDate}' },
          { field: 'region', operator: 'equals', value: 'APAC' }
        ],
        crossTaskConditions: [],
        completionCriteria: 'all-completed'
      },
      phaseAction: {
        eventType: 'phase-completed',
        eventName: '',
        contextMapping: {
          businessDate: '${businessDate}',
          region: '${region}',
          phaseId: '${phaseId}'
        },
        customContext: []
      }
    };
    setPhases([...phases, newPhase]);
  };

  const updatePhase = (id, field, value) => {
    setPhases(phases.map(phase => 
      phase.id === id ? { ...phase, [field]: value } : phase
    ));
  };

  const removePhase = (id) => {
    setPhases(phases.filter(phase => phase.id !== id));
  };

  const addCalculatorToPhase = (phaseId, calculator) => {
    // Check if calculator is already in the phase
    const phase = phases.find(p => p.id === phaseId);
    if (phase && phase.calculators.some(calc => calc.name === calculator.name)) {
      return; // Already added
    }
    
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, calculators: [...phase.calculators, calculator] }
        : phase
    ));
  };

  const removeCalculatorFromPhase = (phaseId, calculatorName) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, calculators: phase.calculators.filter(calc => calc.name !== calculatorName) }
        : phase
    ));
  };

  const openCorrelationModal = (phase) => {
    setSelectedPhase(phase);
    setShowCorrelationModal(true);
  };

  const openActionModal = (phase) => {
    setSelectedPhase(phase);
    setShowActionModal(true);
  };

  const updateCorrelationConditions = (conditions) => {
    if (!selectedPhase) return;
    
    setPhases(phases.map(phase => 
      phase.id === selectedPhase.id 
        ? { ...phase, correlationConditions: conditions }
        : phase
    ));
    
    setShowCorrelationModal(false);
    setSelectedPhase(null);
  };

  const updatePhaseAction = (action) => {
    if (!selectedPhase) return;
    
    setPhases(phases.map(phase => 
      phase.id === selectedPhase.id 
        ? { ...phase, phaseAction: action }
        : phase
    ));
    
    setShowActionModal(false);
    setSelectedPhase(null);
  };

  const generateProcess = () => {
    const process = {
      name: processName,
      description: processDescription,
      phases: phases,
      calculators: availableCalculators,
      correlationConfig: {
        processId: `process_${Date.now()}`,
        businessProcess: processName,
        phases: phases.map(phase => ({
          phaseId: phase.id,
          phaseName: phase.name,
          calculators: phase.calculators.map(calc => ({
            taskName: calc.taskName,
            taskName: calc.name
          })),
          correlationConditions: phase.correlationConditions,
          phaseAction: phase.phaseAction,
          completionEvent: 'task-completed',
          contextMapping: {
            businessDate: '${businessDate}',
            region: '${region}',
            processId: '${processId}'
          }
        }))
      }
    };
    onProcessGenerated(process);
  };

  const CorrelationModal = ({ phase, onSave, onCancel }) => {
    const [conditions, setConditions] = useState(phase.correlationConditions || {
      requiredEvents: ['task-completed'],
      contextConditions: [
        { field: 'businessDate', operator: 'equals', value: '${businessDate}' },
        { field: 'region', operator: 'equals', value: 'APAC' }
      ],
      crossTaskConditions: [],
      completionCriteria: 'all-completed'
    });

    const addContextCondition = () => {
      setConditions({
        ...conditions,
        contextConditions: [...conditions.contextConditions, { field: '', operator: 'equals', value: '' }]
      });
    };

    const updateContextCondition = (index, field, value) => {
      const updatedConditions = [...conditions.contextConditions];
      updatedConditions[index] = { ...updatedConditions[index], [field]: value };
      setConditions({ ...conditions, contextConditions: updatedConditions });
    };

    const removeContextCondition = (index) => {
      const updatedConditions = conditions.contextConditions.filter((_, i) => i !== index);
      setConditions({ ...conditions, contextConditions: updatedConditions });
    };

    const addCrossTaskCondition = () => {
      setConditions({
        ...conditions,
        crossTaskConditions: [...conditions.crossTaskConditions, { 
          sourceTask: '', 
          sourceField: '', 
          operator: 'equals', 
          targetTask: '', 
          targetField: '' 
        }]
      });
    };

    const updateCrossTaskCondition = (index, field, value) => {
      const updatedConditions = [...conditions.crossTaskConditions];
      updatedConditions[index] = { ...updatedConditions[index], [field]: value };
      setConditions({ ...conditions, crossTaskConditions: updatedConditions });
    };

    const removeCrossTaskCondition = (index) => {
      const updatedConditions = conditions.crossTaskConditions.filter((_, i) => i !== index);
      setConditions({ ...conditions, crossTaskConditions: updatedConditions });
    };

    // Get all available tasks from all phases for cross-task conditions
    const getAllAvailableTasks = () => {
      const allTasks = [];
      if (phases && Array.isArray(phases)) {
        phases.forEach(p => {
          if (p.calculators && Array.isArray(p.calculators)) {
            p.calculators.forEach(calc => {
              allTasks.push({
                taskName: calc.taskName,
                displayName: calc.name,
                phase: p.name
              });
            });
          }
        });
      }
      return allTasks;
    };

    const availableTasks = getAllAvailableTasks();

    return (
      <div className="correlation-modal-overlay">
        <div className="correlation-modal">
          <div className="modal-header">
            <h3>🔗 Phase Correlation Conditions for {phase.name}</h3>
            <button onClick={onCancel} className="modal-close">×</button>
          </div>
          
          <div className="modal-content">
            <div className="condition-section">
              <h4>Required Events</h4>
              <p className="section-description">
                Specify which task events must occur for this phase to be considered complete:
              </p>
              <div className="event-checkboxes">
                {['task-started', 'task-completed', 'task-failed'].map(event => (
                  <label key={event} className="event-checkbox">
                    <input
                      type="checkbox"
                      checked={conditions.requiredEvents.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConditions({
                            ...conditions,
                            requiredEvents: [...conditions.requiredEvents, event]
                          });
                        } else {
                          setConditions({
                            ...conditions,
                            requiredEvents: conditions.requiredEvents.filter(e => e !== event)
                          });
                        }
                      }}
                    />
                    <span>{event}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="condition-section">
              <h4>Context Conditions</h4>
              <p className="section-description">
                Specify conditions that must be met in the task context (e.g., same businessDate and region):
              </p>
              
              <div className="context-conditions">
                {conditions.contextConditions && conditions.contextConditions.map((condition, index) => (
                  <div key={index} className="context-condition-row">
                    <select
                      value={condition.field}
                      onChange={(e) => updateContextCondition(index, 'field', e.target.value)}
                    >
                      <option value="">Select field</option>
                      <option value="businessDate">businessDate</option>
                      <option value="region">region</option>
                      <option value="customerId">customerId</option>
                      <option value="productId">productId</option>
                      <option value="warehouse">warehouse</option>
                    </select>
                    
                    <select
                      value={condition.operator}
                      onChange={(e) => updateContextCondition(index, 'operator', e.target.value)}
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="contains">contains</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                    </select>
                    
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateContextCondition(index, 'value', e.target.value)}
                      placeholder="Value or variable (e.g., APAC, ${businessDate})"
                    />
                    
                    <button
                      onClick={() => removeContextCondition(index)}
                      className="remove-condition-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button onClick={addContextCondition} className="add-condition-btn">
                  + Add Context Condition
                </button>
              </div>
            </div>

            <div className="condition-section">
              <h4>Cross-Task Conditions</h4>
              <p className="section-description">
                Specify conditions between tasks in this phase and other tasks (e.g., this phase's businessDate equals another task's businessDate):
              </p>
              
              <div className="cross-task-conditions">
                {conditions.crossTaskConditions && conditions.crossTaskConditions.map((condition, index) => (
                  <div key={index} className="cross-task-condition-row">
                    <div className="condition-group">
                      <label>Source Task:</label>
                      <select
                        value={condition.sourceTask}
                        onChange={(e) => updateCrossTaskCondition(index, 'sourceTask', e.target.value)}
                      >
                        <option value="">Select task</option>
                        {availableTasks && availableTasks.map(task => (
                          <option key={task.taskName} value={task.taskName}>
                            {task.displayName} ({task.phase})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="condition-group">
                      <label>Source Field:</label>
                      <select
                        value={condition.sourceField}
                        onChange={(e) => updateCrossTaskCondition(index, 'sourceField', e.target.value)}
                      >
                        <option value="">Select field</option>
                        <option value="businessDate">businessDate</option>
                        <option value="region">region</option>
                        <option value="customerId">customerId</option>
                        <option value="productId">productId</option>
                        <option value="warehouse">warehouse</option>
                      </select>
                    </div>
                    
                    <div className="condition-group">
                      <label>Operator:</label>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCrossTaskCondition(index, 'operator', e.target.value)}
                      >
                        <option value="equals">equals</option>
                        <option value="not_equals">not equals</option>
                        <option value="greater_than">greater than</option>
                        <option value="less_than">less than</option>
                      </select>
                    </div>
                    
                    <div className="condition-group">
                      <label>Target Task:</label>
                      <select
                        value={condition.targetTask}
                        onChange={(e) => updateCrossTaskCondition(index, 'targetTask', e.target.value)}
                      >
                        <option value="">Select task</option>
                        {availableTasks && availableTasks.map(task => (
                          <option key={task.taskName} value={task.taskName}>
                            {task.displayName} ({task.phase})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="condition-group">
                      <label>Target Field:</label>
                      <select
                        value={condition.targetField}
                        onChange={(e) => updateCrossTaskCondition(index, 'targetField', e.target.value)}
                      >
                        <option value="">Select field</option>
                        <option value="businessDate">businessDate</option>
                        <option value="region">region</option>
                        <option value="customerId">customerId</option>
                        <option value="productId">productId</option>
                        <option value="warehouse">warehouse</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => removeCrossTaskCondition(index)}
                      className="remove-condition-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button onClick={addCrossTaskCondition} className="add-condition-btn">
                  + Add Cross-Task Condition
                </button>
              </div>
            </div>

            <div className="condition-section">
              <h4>Completion Criteria</h4>
              <p className="section-description">
                How should the system determine when this phase is complete:
              </p>
              <select
                value={conditions.completionCriteria}
                onChange={(e) => setConditions({ ...conditions, completionCriteria: e.target.value })}
              >
                <option value="all-completed">All required events completed</option>
                <option value="any-completed">Any required event completed</option>
                <option value="specific-event">Specific event only</option>
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button onClick={() => onSave(conditions)} className="save-btn">
              Save Conditions
            </button>
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PhaseActionModal = ({ phase, onSave, onCancel }) => {
    const [action, setAction] = useState(phase.phaseAction || {
      eventType: 'phase-completed',
      eventName: '',
      contextMapping: {
        businessDate: '${businessDate}',
        region: '${region}',
        phaseId: '${phaseId}'
      },
      customContext: []
    });

    const addCustomContext = () => {
      setAction({
        ...action,
        customContext: [...action.customContext, { 
          key: '', 
          source: 'task-event', 
          sourceTask: '', 
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

    // Get all available tasks from all phases for context selection
    const getAllAvailableTasks = () => {
      const allTasks = [];
      if (phases && Array.isArray(phases)) {
        phases.forEach(p => {
          if (p.calculators && Array.isArray(p.calculators)) {
            p.calculators.forEach(calc => {
              allTasks.push({
                taskName: calc.taskName,
                displayName: calc.name,
                phase: p.name
              });
            });
          }
        });
      }
      return allTasks;
    };

    const availableTasks = getAllAvailableTasks();

    return (
      <div className="correlation-modal-overlay">
        <div className="correlation-modal">
          <div className="modal-header">
            <h3>⚡ Phase Action Configuration for {phase.name}</h3>
            <button onClick={onCancel} className="modal-close">×</button>
          </div>
          
          <div className="modal-content">
            <div className="condition-section">
              <h4>Event Configuration</h4>
              <p className="section-description">
                Configure what event to publish when this phase completes:
              </p>
              
              <div className="input-group">
                <label>Event Type:</label>
                <select
                  value={action.eventType}
                  onChange={(e) => setAction({ ...action, eventType: e.target.value })}
                >
                  <option value="phase-completed">Phase Completed</option>
                  <option value="phase-started">Phase Started</option>
                  <option value="phase-failed">Phase Failed</option>
                  <option value="custom-event">Custom Event</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Event Name:</label>
                <input
                  type="text"
                  value={action.eventName}
                  onChange={(e) => setAction({ ...action, eventName: e.target.value })}
                  placeholder="e.g., financial-close-phase-1-completed"
                />
              </div>
            </div>

            <div className="condition-section">
              <h4>Context Mapping</h4>
              <p className="section-description">
                Select context attributes from task events, phase events, or specify custom values:
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
                    <option value="task-event">From Task Event</option>
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
                    <option value="task-event">From Task Event</option>
                    <option value="phase-event">From Phase Event</option>
                    <option value="custom">Custom Value</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label>Phase ID:</label>
                  <select
                    value={action.contextMapping.phaseId}
                    onChange={(e) => setAction({
                      ...action,
                      contextMapping: { ...action.contextMapping, phaseId: e.target.value }
                    })}
                  >
                    <option value="${phaseId}">Current Phase ID</option>
                    <option value="task-event">From Task Event</option>
                    <option value="phase-event">From Phase Event</option>
                    <option value="custom">Custom Value</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="condition-section">
              <h4>Custom Context Attributes</h4>
              <p className="section-description">
                Add custom context attributes from specific task or phase events:
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
                        placeholder="e.g., customerId, productId"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Source:</label>
                      <select
                        value={context.source}
                        onChange={(e) => updateCustomContext(index, 'source', e.target.value)}
                      >
                        <option value="task-event">Task Event</option>
                        <option value="phase-event">Phase Event</option>
                        <option value="process-context">Process Context</option>
                        <option value="custom">Custom Value</option>
                      </select>
                    </div>
                    
                    {context.source === 'task-event' && (
                      <div className="input-group">
                        <label>Source Task:</label>
                        <select
                          value={context.sourceTask}
                          onChange={(e) => updateCustomContext(index, 'sourceTask', e.target.value)}
                        >
                          <option value="">Select task</option>
                          {availableTasks && availableTasks.map(task => (
                            <option key={task.taskName} value={task.taskName}>
                              {task.displayName} ({task.phase})
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
                        placeholder="e.g., context.customerId, data.region"
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
          </div>
          
          <div className="modal-actions">
            <button onClick={() => onSave(action)} className="save-btn">
              Save Action
            </button>
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="process-builder">
      <div className="builder-section">
        <h3>🏗️ Process Builder</h3>
        
        <div className="process-info">
          <div className="input-group">
            <label>Process Name:</label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g., Daily Financial Close"
            />
          </div>
          
          <div className="input-group">
            <label>Description:</label>
            <textarea
              value={processDescription}
              onChange={(e) => setProcessDescription(e.target.value)}
              placeholder="Describe the business process..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="builder-section">
        <div className="section-header">
          <h4>📋 Process Phases</h4>
          <button onClick={addPhase} className="add-btn">+ Add Phase</button>
        </div>
        
        {phases.length === 0 && (
          <div className="empty-state">
            <p>No phases defined yet. Click "Add Phase" to get started!</p>
          </div>
        )}
        
        <div className="phases-list">
          {phases.map((phase) => (
            <div key={phase.id} className="phase-item">
              <div className="phase-header">
                <div className="phase-title-section">
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                    className="phase-name-input"
                  />
                  <button
                    onClick={() => openCorrelationModal(phase)}
                    className="correlation-btn"
                    title="Configure phase correlation conditions"
                  >
                    🔗 Phase Conditions
                  </button>
                  <button
                    onClick={() => openActionModal(phase)}
                    className="action-btn"
                    title="Configure phase action"
                  >
                    ⚡ Phase Action
                  </button>
                </div>
                <button 
                  onClick={() => removePhase(phase.id)}
                  className="remove-btn"
                >
                  🗑️
                </button>
              </div>
              
              <textarea
                value={phase.description}
                onChange={(e) => updatePhase(phase.id, 'description', e.target.value)}
                placeholder="Phase description..."
                className="phase-description-input"
                rows={2}
              />
              
              <div className="phase-calculators">
                <strong>Calculators in this phase:</strong>
                {phase.calculators.length === 0 ? (
                  <div className="no-calculators">
                    <span>No calculators selected. Add calculators from the list below.</span>
                  </div>
                ) : (
                  <div className="calculator-tags">
                    {phase.calculators.map((calc, index) => (
                      <div key={index} className="calculator-tag-container">
                        <span className="calculator-tag">
                          {calc.name}
                          <button 
                            onClick={() => removeCalculatorFromPhase(phase.id, calc.name)}
                            className="remove-calc-btn"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="builder-section">
        <h4>🧮 Available Calculators</h4>
        {phases.length === 0 ? (
          <div className="empty-state">
            <p>Create phases first to add calculators to them!</p>
          </div>
        ) : (
          <>
            <p className="section-description">
              Click the buttons below to add calculators to specific phases. Each phase has its own correlation conditions and actions that apply to all calculators in that phase.
            </p>
            <div className="calculators-grid">
              {availableCalculators.map((calculator) => (
                <div key={calculator.name} className="calculator-item">
                  <div className="calculator-info">
                    <div className="calculator-header">
                      <span className="calc-icon">🧮</span>
                      <span className="calc-name">{calculator.name}</span>
                    </div>
                    <p className="calc-description">{calculator.description}</p>
                    <span className="calc-app">{calculator.application}</span>
                  </div>
                  
                  <div className="calculator-actions">
                    {phases.map((phase) => {
                      const isAdded = phase.calculators.some(calc => calc.name === calculator.name);
                      return (
                        <button
                          key={phase.id}
                          onClick={() => addCalculatorToPhase(phase.id, calculator)}
                          className={`add-to-phase-btn ${isAdded ? 'added' : ''}`}
                          disabled={isAdded}
                        >
                          {isAdded ? '✓ Added to ' : 'Add to '}{phase.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="builder-actions">
        <button 
          onClick={generateProcess}
          className="generate-process-btn"
          disabled={!processName || phases.length === 0}
        >
          🚀 Generate Process Flow
        </button>
      </div>

      {showCorrelationModal && selectedPhase && (
        <CorrelationModal
          phase={selectedPhase}
          onSave={updateCorrelationConditions}
          onCancel={() => {
            setShowCorrelationModal(false);
            setSelectedPhase(null);
          }}
        />
      )}
      {showActionModal && selectedPhase && (
        <PhaseActionModal
          phase={selectedPhase}
          onSave={updatePhaseAction}
          onCancel={() => {
            setShowActionModal(false);
            setSelectedPhase(null);
          }}
        />
      )}
    </div>
  );
};

export default ProcessBuilder;
