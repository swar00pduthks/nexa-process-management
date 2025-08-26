import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Active Processes', value: '45', icon: '📊', color: 'var(--nexa-primary-600)' },
    { title: 'Processes Running', value: '12', icon: '🔄', color: 'var(--nexa-data-green)' },
    { title: 'Alerts Today', value: '8', icon: '🔔', color: 'var(--nexa-data-orange)' },
    { title: 'Success Rate', value: '98%', icon: '✅', color: 'var(--nexa-data-green)' }
  ];

  const recentProcesses = [
    { name: 'Daily Financial Close', status: 'completed', time: '2 hours ago' },
    { name: 'Customer Retention Alert', status: 'running', time: '30 minutes ago' },
    { name: 'Inventory Reorder', status: 'failed', time: '1 hour ago' },
    { name: 'Sales Report Generation', status: 'completed', time: '3 hours ago' }
  ];

  const quickActions = [
    { title: 'Create Event Correlation', description: 'Build rules to trigger actions based on events', path: '/correlation', icon: '🔗' },
    { title: 'Design Process Flow', description: 'Create multi-step business processes', path: '/orchestration', icon: '🔄' },
    { title: 'View Templates', description: 'Browse pre-built automation templates', path: '/templates', icon: '📋' },
    { title: 'Monitor Performance', description: 'Track automation performance and metrics', path: '/monitoring', icon: '📈' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Nexa Business Process Management</h1>
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
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="quick-action-card">
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Recent Processes</h2>
          <div className="processes-list">
            {recentProcesses.map((process, index) => (
              <div key={index} className="process-item">
                <div className="process-info">
                  <h4>{process.name}</h4>
                  <span className="process-time">{process.time}</span>
                </div>
                <div className={`process-status ${process.status}`}>
                  {process.status === 'completed' && '✅'}
                  {process.status === 'running' && '🔄'}
                  {process.status === 'failed' && '❌'}
                  {process.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
