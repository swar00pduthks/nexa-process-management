import React, { useState } from 'react';
import processService from '../services/processService';
import './SaveProcessModal.css';

const SaveProcessModal = ({ flowData, onSave, onClose }) => {
  const [processName, setProcessName] = useState('');
  const [processDescription, setProcessDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'general',
    'finance',
    'sales',
    'marketing',
    'operations',
    'customer-service',
    'inventory',
    'reporting',
    'automation'
  ];

  const handleSave = async () => {
    if (!processName.trim()) {
      setError('Process name is required');
      return;
    }

    if (!processDescription.trim()) {
      setError('Process description is required');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      const processData = processService.convertFlowToProcess(
        flowData,
        processName.trim(),
        processDescription.trim()
      );

      // Add category and tags
      processData.category = category;
      processData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const savedProcess = await processService.saveProcess(processData);
      
      onSave(savedProcess);
    } catch (err) {
      setError('Failed to save process. Please try again.');
      console.error('Error saving process:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div className="save-process-overlay">
      <div className="save-process-modal">
        <div className="modal-header">
          <h3>💾 Save Business Process</h3>
          <button 
            className="modal-close" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="processName">Process Name *</label>
            <input
              id="processName"
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g., Customer Sales P&L Calculator"
              className="form-input"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="processDescription">Description *</label>
            <textarea
              id="processDescription"
              value={processDescription}
              onChange={(e) => setProcessDescription(e.target.value)}
              placeholder="Describe what this business process does..."
              className="form-textarea"
              rows="3"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              disabled={isSaving}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., automation, finance, reporting"
              className="form-input"
              disabled={isSaving}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="flow-summary">
            <h4>Flow Summary</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Nodes:</span>
                <span className="stat-value">{flowData.nodes?.length || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Edges:</span>
                <span className="stat-value">{flowData.edges?.length || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Entities:</span>
                <span className="stat-value">
                  {flowData.nodes?.filter(n => n.type === 'entityNode').length || 0}
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Actions:</span>
                <span className="stat-value">
                  {flowData.nodes?.filter(n => n.type === 'actionNode').length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={isSaving || !processName.trim() || !processDescription.trim()}
          >
            {isSaving ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              '💾 Save Process'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveProcessModal;


