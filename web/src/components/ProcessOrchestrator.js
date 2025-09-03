import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import processService from '../services/processService';
import './ProcessOrchestrator.css';

const ProcessOrchestrator = () => {
  const [savedProcesses, setSavedProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, failed
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Load saved business processes from database
  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const processes = await processService.loadAllProcesses();
      // Filter for business processes only
      const businessProcesses = processes.filter(p => p.processType === 'BUSINESS_PROCESS');
      setSavedProcesses(businessProcesses);
    } catch (err) {
      setError('Failed to load business processes. Please try again.');
      console.error('Error loading processes:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Processes', value: savedProcesses.length.toString(), icon: '🏗️', color: '#111827' },
    { title: 'Active Processes', value: savedProcesses.filter(p => p.status === 'active').length.toString(), icon: '🔄', color: '#10b981' },
    { title: 'Completed Today', value: '15', icon: '✅', color: '#10b981' },
    { title: 'Success Rate', value: '97%', icon: '📈', color: '#3b82f6' }
  ];

  const quickActions = [
    { title: 'Create Business Process', description: 'Design multi-step business processes', path: '/flow-builder', icon: '🏗️', color: '#10b981' },
    { title: 'Process Templates', description: 'Browse pre-built business process templates', path: '/templates', icon: '📋', color: '#8b5cf6' },
    { title: 'Process Analytics', description: 'Business process analytics and insights', path: '/analytics', icon: '📊', color: '#3b82f6' },
    { title: 'Process Monitoring', description: 'Real-time process monitoring and alerting', path: '/monitoring', icon: '👁️', color: '#f59e0b' }
  ];

  const getProcessStatus = (process) => {
    // Mock status based on process data - in real app this would come from backend
    const statuses = ['active', 'completed', 'failed', 'pending'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const filteredProcesses = savedProcesses.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           process.metadata?.category === selectedCategory;
    const matchesFilter = filter === 'all' || getProcessStatus(process) === filter;
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const categories = ['all', ...new Set(savedProcesses.map(p => p.metadata?.category).filter(Boolean))];

  const handleProcessClick = (process) => {
    // Navigate to flow builder with this process loaded
    navigate('/flow-builder', { 
      state: { 
        loadProcess: true, 
        processId: process.id 
      } 
    });
  };

  const handleEditProcess = (process, e) => {
    e.stopPropagation();
    // Navigate to flow builder with this process loaded
    navigate('/flow-builder', { 
      state: { 
        loadProcess: true, 
        processId: process.id 
      } 
    });
  };

  const handleDeleteProcess = async (process, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${process.name}"?`)) {
      try {
        await processService.deleteProcess(process.id);
        setSavedProcesses(prev => prev.filter(p => p.id !== process.id));
      } catch (err) {
        console.error('Error deleting process:', err);
        alert('Failed to delete process. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="process-orchestrator">
        <div className="orchestrator-header">
          <h1>🏗️ Business Process Orchestration</h1>
          <p>Design and manage complex business processes across your organization</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading business processes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="process-orchestrator">
        <div className="orchestrator-header">
          <h1>🏗️ Business Process Orchestration</h1>
          <p>Design and manage complex business processes across your organization</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Processes</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadProcesses}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="process-orchestrator">
      <div className="orchestrator-header">
        <h1>🏗️ Business Process Orchestration</h1>
        <p>Design and manage complex business processes across your organization</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="orchestrator-content">
        <div className="content-section">
          <h2>🚀 Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="quick-action-card">
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>📋 Business Processes</h2>
            <div className="controls-row">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search processes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
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
              <div className="filter-controls">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All ({savedProcesses.length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active ({savedProcesses.filter(p => getProcessStatus(p) === 'active').length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed ({savedProcesses.filter(p => getProcessStatus(p) === 'completed').length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
                  onClick={() => setFilter('failed')}
                >
                  Failed ({savedProcesses.filter(p => getProcessStatus(p) === 'failed').length})
                </button>
              </div>
            </div>
          </div>

          {savedProcesses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗️</div>
              <h3>No Business Processes Yet</h3>
              <p>Create your first business process to get started with process orchestration</p>
              <Link to="/flow-builder" className="create-process-btn">
                🚀 Create Your First Process
              </Link>
            </div>
          ) : filteredProcesses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Processes Found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="clear-filters-btn" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setFilter('all');
              }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="processes-grid">
              {filteredProcesses.map((process) => {
                const status = getProcessStatus(process);
                const statusColor = getStatusColor(status);
                const statusIcon = getStatusIcon(status);
                
                return (
                  <div 
                    key={process.id} 
                    className="process-tile"
                    onClick={() => handleProcessClick(process)}
                  >
                    <div className="process-header">
                      <div className="process-title">
                        <h3>{process.name}</h3>
                        <span className="process-type">Business Process</span>
                      </div>
                      <div className="process-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={(e) => handleEditProcess(process, e)}
                          title="Edit Process"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={(e) => handleDeleteProcess(process, e)}
                          title="Delete Process"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="process-content">
                      <p className="process-description">
                        {process.description || 'No description available'}
                      </p>
                      
                      <div className="process-details">
                        <div className="detail-item">
                          <span className="detail-label">Phases:</span>
                          <span className="detail-value">{process.nodes?.filter(n => n.type === 'phaseNode').length || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Tasks:</span>
                          <span className="detail-value">{process.nodes?.filter(n => n.type === 'actionNode').length || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">
                            {new Date(process.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {process.metadata?.category && (
                        <div className="process-category">
                          <span className="category-badge">{process.metadata.category}</span>
                        </div>
                      )}

                      {process.metadata?.tags && process.metadata.tags.length > 0 && (
                        <div className="process-tags">
                          {process.metadata.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ))}
                          {process.metadata.tags.length > 3 && (
                            <span className="tag more">
                              +{process.metadata.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="process-footer">
                      <div className="process-status" style={{ color: statusColor }}>
                        <span className="status-icon">{statusIcon}</span>
                        <span className="status-text">{status}</span>
                      </div>
                      <div className="process-meta">
                        <span className="process-id">ID: {process.id.slice(-8)}</span>
                        <span className="process-version">v{process.metadata?.version || '1.0'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessOrchestrator;
