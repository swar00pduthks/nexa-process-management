import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import processService from '../services/processService';
import './Dashboard.css';

const Dashboard = () => {
  const [allProcesses, setAllProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load all processes from database
  useEffect(() => {
    loadAllProcesses();
  }, []);

  const loadAllProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const processes = await processService.loadAllProcesses();
      setAllProcesses(processes);
    } catch (err) {
      setError('Failed to load processes. Please try again.');
      console.error('Error loading processes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics for all process types
  const businessProcesses = allProcesses.filter(p => p.processType === 'BUSINESS_PROCESS');
  const eventCorrelations = allProcesses.filter(p => p.processType === 'EVENT_CORRELATION');
  const dataFlows = allProcesses.filter(p => p.processType === 'DATA_FLOW');

  const stats = [
    { title: 'Total Processes', value: allProcesses.length.toString(), icon: '📊', color: '#111827' },
    { title: 'Business Processes', value: businessProcesses.length.toString(), icon: '🏗️', color: '#10b981' },
    { title: 'Event Correlations', value: eventCorrelations.length.toString(), icon: '🔗', color: '#3b82f6' },
    { title: 'Data Flows', value: dataFlows.length.toString(), icon: '📈', color: '#8b5cf6' }
  ];

  const quickActions = [
    { title: 'Business Process Orchestration', description: 'Design and manage complex business processes', path: '/orchestration', icon: '🏗️', color: '#10b981' },
    { title: 'Event Correlation', description: 'Monitor and correlate events across your data ecosystem', path: '/correlation', icon: '🔗', color: '#3b82f6' },
    { title: 'Flow Builder', description: 'Visual flow builder for all process types', path: '/flow-builder', icon: '🎨', color: '#f59e0b' },
    { title: 'Process Analytics', description: 'Analytics and insights across all processes', path: '/analytics', icon: '📊', color: '#8b5cf6' }
  ];

  const recentActivity = allProcesses
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  const getProcessTypeIcon = (processType) => {
    switch (processType) {
      case 'BUSINESS_PROCESS': return '🏗️';
      case 'EVENT_CORRELATION': return '🔗';
      case 'DATA_FLOW': return '📈';
      default: return '📋';
    }
  };

  const getProcessTypeColor = (processType) => {
    switch (processType) {
      case 'BUSINESS_PROCESS': return '#10b981';
      case 'EVENT_CORRELATION': return '#3b82f6';
      case 'DATA_FLOW': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getProcessTypeName = (processType) => {
    switch (processType) {
      case 'BUSINESS_PROCESS': return 'Business Process';
      case 'EVENT_CORRELATION': return 'Event Correlation';
      case 'DATA_FLOW': return 'Data Flow';
      default: return 'Process';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>🏢 Nexa Business Process Management</h1>
          <p>Monitor and manage your automated business processes across the Nexa Data Platform</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>🏢 Nexa Business Process Management</h1>
          <p>Monitor and manage your automated business processes across the Nexa Data Platform</p>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadAllProcesses}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🏢 Nexa Business Process Management</h1>
        <p>Monitor and manage your automated business processes across the Nexa Data Platform</p>
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

      <div className="dashboard-content">
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
            <h2>📋 Recent Activity</h2>
            <Link to="/flow-builder" className="view-all-btn">
              View All Processes →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Processes Yet</h3>
              <p>Create your first process to get started with automation</p>
              <Link to="/flow-builder" className="create-process-btn">
                🚀 Create Your First Process
              </Link>
            </div>
          ) : (
            <div className="recent-activity-list">
              {recentActivity.map((process) => (
                <div 
                  key={process.id} 
                  className="activity-item"
                  onClick={() => navigate('/flow-builder', { 
                    state: { 
                      loadProcess: true, 
                      processId: process.id 
                    } 
                  })}
                >
                  <div className="activity-icon" style={{ color: getProcessTypeColor(process.processType) }}>
                    {getProcessTypeIcon(process.processType)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <h4>{process.name}</h4>
                      <span className="process-type-badge" style={{ backgroundColor: getProcessTypeColor(process.processType) }}>
                        {getProcessTypeName(process.processType)}
                      </span>
                    </div>
                    <p className="activity-description">
                      {process.description || 'No description available'}
                    </p>
                    <div className="activity-meta">
                      <span className="activity-date">
                        {new Date(process.updatedAt || process.createdAt).toLocaleDateString()}
                      </span>
                      <span className="activity-nodes">
                        {process.nodes?.length || 0} nodes
                      </span>
                    </div>
                  </div>
                  <div className="activity-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="content-section">
          <h2>📊 Process Type Overview</h2>
          <div className="process-types-grid">
            <div className="process-type-card" onClick={() => navigate('/orchestration')}>
              <div className="type-icon" style={{ color: '#10b981' }}>🏗️</div>
              <h3>Business Processes</h3>
              <p className="type-count">{businessProcesses.length} processes</p>
              <p className="type-description">Design and orchestrate complex business workflows</p>
              <div className="type-actions">
                <button className="type-btn">View All</button>
                <button className="type-btn primary">Create New</button>
              </div>
            </div>

            <div className="process-type-card" onClick={() => navigate('/correlation')}>
              <div className="type-icon" style={{ color: '#3b82f6' }}>🔗</div>
              <h3>Event Correlations</h3>
              <p className="type-count">{eventCorrelations.length} correlations</p>
              <p className="type-description">Monitor and correlate events across systems</p>
              <div className="type-actions">
                <button className="type-btn">View All</button>
                <button className="type-btn primary">Create New</button>
              </div>
            </div>

            <div className="process-type-card" onClick={() => navigate('/flow-builder')}>
              <div className="type-icon" style={{ color: '#8b5cf6' }}>📈</div>
              <h3>Data Flows</h3>
              <p className="type-count">{dataFlows.length} flows</p>
              <p className="type-description">Build data transformation and ETL pipelines</p>
              <div className="type-actions">
                <button className="type-btn">View All</button>
                <button className="type-btn primary">Create New</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
