import React, { useState, useEffect } from 'react';
import processService from '../services/processService';
import './ProcessSelector.css';

const ProcessSelector = ({ onProcessSelect, onClose }) => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      const processesData = await processService.loadAllProcesses();
      setProcesses(processesData);
    } catch (err) {
      setError('Failed to load processes. Please try again.');
      console.error('Error loading processes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSelect = (process) => {
    const flowData = processService.convertProcessToFlow(process);
    onProcessSelect(flowData, process);
  };

  const handleDeleteProcess = async (processId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this process?')) {
      try {
        await processService.deleteProcess(processId);
        setProcesses(processes.filter(p => p.id !== processId));
      } catch (err) {
        console.error('Error deleting process:', err);
        alert('Failed to delete process. Please try again.');
      }
    }
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           process.metadata?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(processes.map(p => p.metadata?.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="process-selector-overlay">
        <div className="process-selector">
          <div className="selector-header">
            <h3>📋 Select Business Process</h3>
            <button className="selector-close" onClick={onClose}>×</button>
          </div>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading processes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="process-selector-overlay">
        <div className="process-selector">
          <div className="selector-header">
            <h3>📋 Select Business Process</h3>
            <button className="selector-close" onClick={onClose}>×</button>
          </div>
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h4>Error Loading Processes</h4>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadProcesses}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="process-selector-overlay">
      <div className="process-selector">
        <div className="selector-header">
          <h3>📋 Select Business Process</h3>
          <button className="selector-close" onClick={onClose}>×</button>
        </div>
        
        <div className="selector-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="processes-list">
          {filteredProcesses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h4>No processes found</h4>
              <p>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or category filter.'
                  : 'No business processes have been saved yet. Create your first process in the Flow Builder!'
                }
              </p>
            </div>
          ) : (
            filteredProcesses.map(process => (
              <div
                key={process.id}
                className="process-item"
                onClick={() => handleProcessSelect(process)}
              >
                <div className="process-info">
                  <div className="process-header">
                    <h4 className="process-name">{process.name}</h4>
                    <div className="process-actions">
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDeleteProcess(process.id, e)}
                        title="Delete process"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="process-description">{process.description}</p>
                  
                  <div className="process-meta">
                    <span className="process-type">Business Process</span>
                    <span className="process-category">{process.metadata?.category || 'general'}</span>
                    <span className="process-version">v{process.metadata?.version || '1.0'}</span>
                  </div>
                  
                  <div className="process-stats">
                    <span className="stat">
                      <span className="stat-label">Nodes:</span>
                      <span className="stat-value">{process.nodes?.length || 0}</span>
                    </span>
                    <span className="stat">
                      <span className="stat-label">Edges:</span>
                      <span className="stat-value">{process.edges?.length || 0}</span>
                    </span>
                    <span className="stat">
                      <span className="stat-label">Created:</span>
                      <span className="stat-value">
                        {new Date(process.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="process-arrow">→</div>
              </div>
            ))
          )}
        </div>
        
        <div className="selector-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <div className="process-count">
            {filteredProcesses.length} of {processes.length} processes
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSelector;


