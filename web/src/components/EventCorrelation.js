import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import processService from '../services/processService';
import './EventCorrelation.css';

const EventCorrelation = () => {
  const [savedCorrelations, setSavedCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, failed
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // Load saved event correlations from database
  useEffect(() => {
    loadCorrelations();
  }, []);

  const loadCorrelations = async () => {
    try {
      setLoading(true);
      setError(null);
      const correlations = await processService.loadAllProcesses();
      // Filter for event correlations only
      const eventCorrelations = correlations.filter(c => c.processType === 'EVENT_CORRELATION');
      setSavedCorrelations(eventCorrelations);
    } catch (err) {
      setError('Failed to load event correlations. Please try again.');
      console.error('Error loading correlations:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Correlations', value: savedCorrelations.length.toString(), icon: '🔗', color: '#111827' },
    { title: 'Active Correlations', value: savedCorrelations.filter(c => c.status === 'active').length.toString(), icon: '🔄', color: '#10b981' },
    { title: 'Triggered Today', value: '8', icon: '⚡', color: '#3b82f6' },
    { title: 'Success Rate', value: '95%', icon: '📈', color: '#10b981' }
  ];

  const quickActions = [
    { title: 'Create Event Correlation', description: 'Build rules to trigger actions based on events', path: '/flow-builder', icon: '🔗', color: '#3b82f6' },
    { title: 'Monitor Events', description: 'Real-time event monitoring and alerting', path: '/monitoring', icon: '📊', color: '#10b981' },
    { title: 'Event Templates', description: 'Browse pre-built event correlation templates', path: '/templates', icon: '📋', color: '#8b5cf6' },
    { title: 'Analytics', description: 'Event correlation analytics and insights', path: '/analytics', icon: '📈', color: '#f59e0b' }
  ];

  const getCorrelationStatus = (correlation) => {
    // Mock status based on correlation data - in real app this would come from backend
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

  const filteredCorrelations = savedCorrelations.filter(correlation => {
    const matchesSearch = correlation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         correlation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           correlation.metadata?.category === selectedCategory;
    const matchesFilter = filter === 'all' || getCorrelationStatus(correlation) === filter;
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const categories = ['all', ...new Set(savedCorrelations.map(c => c.metadata?.category).filter(Boolean))];

  const handleCorrelationClick = (correlation) => {
    // Navigate to flow builder with this correlation loaded
    navigate('/flow-builder', { 
      state: { 
        loadProcess: true, 
        processId: correlation.id 
      } 
    });
  };

  const handleEditCorrelation = (correlation, e) => {
    e.stopPropagation();
    // Navigate to flow builder with this correlation loaded
    navigate('/flow-builder', { 
      state: { 
        loadProcess: true, 
        processId: correlation.id 
      } 
    });
  };

  const handleDeleteCorrelation = async (correlation, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${correlation.name}"?`)) {
      try {
        await processService.deleteProcess(correlation.id);
        setSavedCorrelations(prev => prev.filter(c => c.id !== correlation.id));
      } catch (err) {
        console.error('Error deleting correlation:', err);
        alert('Failed to delete correlation. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="event-correlation">
        <div className="correlation-header">
          <h1>🔗 Event Correlation Management</h1>
          <p>Monitor and manage event correlations across your data ecosystem</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading event correlations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-correlation">
        <div className="correlation-header">
          <h1>🔗 Event Correlation Management</h1>
          <p>Monitor and manage event correlations across your data ecosystem</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Correlations</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadCorrelations}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-correlation">
      <div className="correlation-header">
        <h1>🔗 Event Correlation Management</h1>
        <p>Monitor and manage event correlations across your data ecosystem</p>
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

      <div className="correlation-content">
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
            <h2>📋 Event Correlations</h2>
            <div className="controls-row">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search correlations..."
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
                  All ({savedCorrelations.length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active ({savedCorrelations.filter(c => getCorrelationStatus(c) === 'active').length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed ({savedCorrelations.filter(c => getCorrelationStatus(c) === 'completed').length})
                </button>
                <button 
                  className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
                  onClick={() => setFilter('failed')}
                >
                  Failed ({savedCorrelations.filter(c => getCorrelationStatus(c) === 'failed').length})
                </button>
              </div>
            </div>
          </div>

          {savedCorrelations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <h3>No Event Correlations Yet</h3>
              <p>Create your first event correlation to get started with event-driven automation</p>
              <Link to="/flow-builder" className="create-correlation-btn">
                🚀 Create Your First Correlation
              </Link>
            </div>
          ) : filteredCorrelations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Correlations Found</h3>
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
            <div className="correlations-grid">
              {filteredCorrelations.map((correlation) => {
                const status = getCorrelationStatus(correlation);
                const statusColor = getStatusColor(status);
                const statusIcon = getStatusIcon(status);
                
                return (
                  <div 
                    key={correlation.id} 
                    className="correlation-tile"
                    onClick={() => handleCorrelationClick(correlation)}
                  >
                    <div className="correlation-header">
                      <div className="correlation-title">
                        <h3>{correlation.name}</h3>
                        <span className="correlation-type">Event Correlation</span>
                      </div>
                      <div className="correlation-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={(e) => handleEditCorrelation(correlation, e)}
                          title="Edit Correlation"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={(e) => handleDeleteCorrelation(correlation, e)}
                          title="Delete Correlation"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="correlation-content">
                      <p className="correlation-description">
                        {correlation.description || 'No description available'}
                      </p>
                      
                      <div className="correlation-details">
                        <div className="detail-item">
                          <span className="detail-label">Events:</span>
                          <span className="detail-value">{correlation.nodes?.filter(n => n.type === 'eventNode').length || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Triggers:</span>
                          <span className="detail-value">{correlation.edges?.length || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">
                            {new Date(correlation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {correlation.metadata?.category && (
                        <div className="correlation-category">
                          <span className="category-badge">{correlation.metadata.category}</span>
                        </div>
                      )}

                      {correlation.metadata?.tags && correlation.metadata.tags.length > 0 && (
                        <div className="correlation-tags">
                          {correlation.metadata.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ))}
                          {correlation.metadata.tags.length > 3 && (
                            <span className="tag more">
                              +{correlation.metadata.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="correlation-footer">
                      <div className="correlation-status" style={{ color: statusColor }}>
                        <span className="status-icon">{statusIcon}</span>
                        <span className="status-text">{status}</span>
                      </div>
                      <div className="correlation-meta">
                        <span className="correlation-id">ID: {correlation.id.slice(-8)}</span>
                        <span className="correlation-version">v{correlation.metadata?.version || '1.0'}</span>
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

export default EventCorrelation;
